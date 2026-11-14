# Next.js 14 → 16 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Sonora from Next.js 14.2 (React 18) to Next.js 16 (React 19) while preserving the custom Express server, Pages Router, and all existing functionality.

**Architecture:** This is a Pages Router app with a custom Express server (BFF pattern). The upgrade touches: Next.js/React/ReactDOM versions, the removed `publicRuntimeConfig` API (replaced with a server-side API endpoint), `react-test-renderer` (removed in React 19, replaced with `@testing-library/react`), and several dependency compatibility updates. The `next-i18next` + `tss-react` SSR integration and `@tanstack/react-query v4` remain compatible but may need minor adjustments.

**Tech Stack:** Next.js 16, React 19, MUI 7, tss-react 4, @tanstack/react-query 4, Jest 30, custom Express server

## Global Constraints

- Node.js 20.9+ required (current: 26.3.0 ✓)
- No new npm packages without explicit approval (per CLAUDE.md)
- Pages Router only — no App Router migration
- Custom Express server must continue to work
- Zero ESLint warnings policy (`--max-warnings=0`)
- `TZ=UTC` required for all test runs
- Keep i18n locale JSON keys sorted alphabetically

---

## Key Breaking Changes Identified

| Change | Impact | Approach |
|--------|--------|----------|
| `publicRuntimeConfig` removed | `_app.js`, `_document.js`, `next.config.js` | Create `/api/config` endpoint, fetch at app init |
| React 19 removes `react-test-renderer` | 17 test files | Migrate to `@testing-library/react` |
| React 19 deprecates `defaultProps` | 5 components | Convert to default parameters |
| `@next/bundle-analyzer` at v12 | `next.config.js` | Upgrade to v16-compatible |
| `eslint-config-next` at v14 | `package.json` | Upgrade to v16 |
| `react-is` override | `package.json` | Upgrade to React 19 compatible |
| `reportWebVitals` removed | `_app.js` | Use `next/web-vitals` or `useReportWebVitals` |
| `jest-next-dynamic` | 2 test files | Replace with direct dynamic import handling |
| Turbopack is default in v16 | dev script | May need `--webpack` flag if incompatible |

---

### Task 1: Create a clean upgrade branch and run the codemod

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Potentially modify: multiple source files (codemod-applied)

**Interfaces:**
- Produces: Updated `next`, `react`, `react-dom` versions in `package.json`; any codemod-applied source transforms

- [ ] **Step 1: Ensure clean git state**

```bash
git status
```

If there are uncommitted changes, commit or stash them before proceeding.

- [ ] **Step 2: Switch to the feature branch**

```bash
git checkout CORE-2123-nextjs-v16
```

- [ ] **Step 3: Run the Next.js upgrade codemod**

```bash
npx @next/codemod@canary upgrade latest
```

When prompted, select "yes" for all options. This will:
- Upgrade `next`, `react`, `react-dom` to latest
- Apply automatic source transforms for async API changes
- Update deprecated imports

- [ ] **Step 4: Review what the codemod changed**

```bash
git diff --stat
git diff
```

Document which files were modified and what patterns were applied.

- [ ] **Step 5: Attempt a build to establish baseline errors**

```bash
npm run build-frontend 2>&1 | head -100
```

Expected: Build will likely fail due to `publicRuntimeConfig` removal and other issues. Record the errors — these guide remaining tasks.

- [ ] **Step 6: Commit codemod results**

```bash
git add -A
git commit -m "CORE-2123 Run Next.js 16 upgrade codemod"
```

---

### Task 2: Remove `publicRuntimeConfig` — create server-side config endpoint

**Files:**
- Create: `src/server/api/config.js`
- Modify: `src/pages/api/config.js` (Next.js API route — NOT needed since we use custom Express server)
- Modify: `src/server/index.js` (register new route)
- Modify: `next.config.js` (remove `publicRuntimeConfig`)

**Interfaces:**
- Produces: `GET /api/config` endpoint returning the config JSON object
- Consumes: `config` npm package (already used server-side)

The existing pattern already fetches config and puts it into React context via `ConfigProvider`. The current flow is:
1. `next.config.js` reads config at build time into `publicRuntimeConfig`
2. `_app.js` reads `publicRuntimeConfig` via `getConfig()` and calls `setConfig()`
3. Components consume via `useConfig()`

New flow:
1. Express server exposes `GET /api/config` returning the same config object
2. `_app.js` fetches `/api/config` on mount and calls `setConfig()`
3. Components consume via `useConfig()` (unchanged)

- [ ] **Step 1: Create the Express config route handler**

Create `src/server/api/config.js`:

```javascript
import express from "express";
import config from "config";

const router = express.Router();

const ONE_GiB = 2 ** 30;

function getPublicConfig() {
    return {
        intercom: {
            appId: config.get("intercom.app_id"),
            enabled: config.get("intercom.enabled"),
            companyId: config.get("intercom.company_id"),
            companyName: config.get("intercom.company_name"),
            userProfileUrl: config.get("intercom.user_profile_url"),
        },
        admin: {
            groups: config.get("admin.groups"),
            group_attribute_name: config.get("admin.group_attribute_name"),
        },
        analysis: {
            supportUser: {
                id: config.get("analysis.support.user"),
                source_id: config.get("analysis.support.source_id"),
            },
        },
        irods: {
            home_path: config.get("irods.home_path"),
            trash_path: config.get("irods.trash_path"),
            community_path: config.get("irods.community_path"),
        },
        sessions: {
            poll_interval_ms: config.has("sessions.poll_interval_ms")
                ? config.get("sessions.poll_interval_ms")
                : 5000,
        },
        tools: {
            default_selected_max_cpus: config.has(
                "tools.default_selected_max_cpus"
            )
                ? config.get("tools.default_selected_max_cpus")
                : 4,
            admin: {
                max_cpu_limit: config.has("tools.admin.max_cpu_limit")
                    ? config.get("tools.admin.max_cpu_limit")
                    : 8,
                max_memory_limit: config.has("tools.admin.max_memory_limit")
                    ? config.get("tools.admin.max_memory_limit")
                    : 16 * ONE_GiB,
                max_disk_limit: config.has("tools.admin.max_disk_limit")
                    ? config.get("tools.admin.max_disk_limit")
                    : 512 * ONE_GiB,
                max_gpu_limit: config.has("tools.admin.max_gpu_limit")
                    ? config.get("tools.admin.max_gpu_limit")
                    : 0,
            },
            private: {
                max_cpu_limit: config.has("tools.private.max_cpu_limit")
                    ? config.get("tools.private.max_cpu_limit")
                    : 8,
                max_memory_limit: config.has("tools.private.max_memory_limit")
                    ? config.get("tools.private.max_memory_limit")
                    : 16 * ONE_GiB,
                max_disk_limit: config.has("tools.private.max_disk_limit")
                    ? config.get("tools.private.max_disk_limit")
                    : 512 * ONE_GiB,
                max_gpu_limit: config.has("tools.private.max_gpu_limit")
                    ? config.get("tools.private.max_gpu_limit")
                    : 0,
            },
        },
        fileIdentifiers: {
            htPathList: config.get("fileIdentifier.htPathList"),
            multiInputPathList: config.get("fileIdentifier.multiInputPathList"),
        },
        analytics: {
            enabled: config.get("analytics.enabled"),
            id: config.get("analytics.id"),
        },
        vice: {
            defaultImage: config.get("vice.defaultImage"),
            defaultName: config.get("vice.defaultName"),
            defaultCasUrl: config.get("vice.defaultCasUrl"),
            defaultCasValidate: config.get("vice.defaultCasValidate"),
            concurrentJobs: config.has("vice.concurrentJobs")
                ? config.get("vice.concurrentJobs")
                : 2,
            useCaseMinChars: config.has("vice.useCaseCharsMin")
                ? config.get("vice.useCaseCharsMin")
                : 60,
            initContainerName: config.get("vice.initContainerName"),
            inputFilesContainerName: config.get("vice.inputFilesContainerName"),
            viceProxyContainerName: config.get("vice.viceProxyContainerName"),
            analysisContainerName: config.get("vice.analysisContainerName"),
            deploymentTimeoutMs: config.has("vice.deploymentTimeoutMs")
                ? config.get("vice.deploymentTimeoutMs")
                : 180000,
        },
        grouper: {
            allUsers: config.get("grouper.allUsers"),
            admin: config.get("grouper.admin"),
        },
        subscriptions: {
            checkout_url: config.get("subscriptions.checkout_url"),
            enforce: config.get("subscriptions.enforce"),
        },
        usernameSuffix: config.get("username.suffix"),
        userPortalURL: config.get("user_portal_url"),
        supportEmail: config.get("support_email"),
        deFaq: config.get("de_faq"),
        cyverseURL: config.get("cyverse_url"),
        elasticEnabled: config.get("elastic.enabled"),
        queriesConcurrencyLimit: config.get("queriesConcurrencyLimit"),
    };
}

router.get("/", (req, res) => {
    res.json(getPublicConfig());
});

export default router;
```

- [ ] **Step 2: Register the config route in the Express server**

In `src/server/index.js`, add the import and route registration alongside other routers:

```javascript
import configRouter from "./api/config";
```

And in the route setup section:

```javascript
server.use("/api/config", configRouter);
```

- [ ] **Step 3: Remove `publicRuntimeConfig` from `next.config.js`**

Replace the entire `next.config.js` with:

```javascript
const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/dashboard",
            },
        ];
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        return config;
    },
    i18n,
});
```

- [ ] **Step 4: Verify build compiles without `publicRuntimeConfig` errors**

```bash
npm run build-frontend 2>&1 | grep -i "publicRuntimeConfig\|getConfig\|next/config" | head -10
```

Expected: No errors related to `publicRuntimeConfig` in Next.js config parsing.

- [ ] **Step 5: Commit**

```bash
git add src/server/api/config.js src/server/index.js next.config.js
git commit -m "CORE-2123 Replace publicRuntimeConfig with /api/config endpoint"
```

---

### Task 3: Update `_app.js` to fetch config from API endpoint

**Files:**
- Modify: `src/pages/_app.js`

**Interfaces:**
- Consumes: `GET /api/config` (from Task 2)
- Produces: Config data passed to `ConfigProvider` and Intercom/analytics setup

- [ ] **Step 1: Rewrite _app.js to remove `getConfig` and fetch from `/api/config`**

Remove the import:
```javascript
// REMOVE this line:
import getConfig from "next/config";
```

Replace `reportWebVitals` (removed in Next.js 16) — delete the entire exported function. Web Vitals can be re-added later via `@next/third-parties` or a custom solution if needed.

Replace the config initialization in `MyApp`. Change the `useEffect` that reads `publicRuntimeConfig` to fetch from the API:

```javascript
useEffect(() => {
    let cancelled = false;

    fetch("/api/config")
        .then((res) => res.json())
        .then((data) => {
            if (cancelled) return;

            setConfig(data);

            const jssStyles = document.querySelector("#jss-server-side");
            if (jssStyles) {
                jssStyles.parentElement.removeChild(jssStyles);
            }
            if (data.intercom?.enabled) {
                setupIntercom(data.intercom.appId);
                if (window.Intercom) {
                    window.Intercom(
                        "onUnreadCountChange",
                        function (newUnreadCount) {
                            setUnReadCount(newUnreadCount);
                        }
                    );
                }
            }
        });

    return () => {
        cancelled = true;
    };
}, []);
```

Update the analytics `useEffect` to depend on `config` state instead of `publicRuntimeConfig`:

```javascript
useEffect(() => {
    if (!config?.analytics?.id) return;

    const handleRouteChange = (url) => {
        gtag.pageview(config.analytics.id, url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
    };
}, [config?.analytics?.id, router.events]);
```

Remove the line:
```javascript
// REMOVE:
const { publicRuntimeConfig = {} } = getConfig() || {};
```

- [ ] **Step 2: Verify the app compiles**

```bash
npm run build-frontend 2>&1 | head -50
```

Expected: No errors related to `next/config` imports.

- [ ] **Step 3: Commit**

```bash
git add src/pages/_app.js
git commit -m "CORE-2123 Fetch config from /api/config instead of publicRuntimeConfig"
```

---

### Task 4: Update `_document.js` and `_app.js` to move analytics client-side

**Files:**
- Modify: `src/pages/_document.js`
- Modify: `src/pages/_app.js`
- Remove: `src/gtag.js` (if no longer needed after refactor)

**Interfaces:**
- Consumes: `config.analytics.enabled` and `config.analytics.id` from `/api/config` (Task 2–3)
- Produces: GA script loaded dynamically client-side after config fetch resolves

Since `_document.js` renders server-side and we no longer have `publicRuntimeConfig`, move the GA script injection entirely to `_app.js`. After the `/api/config` fetch resolves and confirms analytics is enabled, dynamically inject the `<script>` tags from JavaScript. This avoids needing `NEXT_PUBLIC_` env vars and keeps everything runtime-configurable.

Tradeoff: analytics won't fire until after the `/api/config` fetch completes (a few hundred ms). This is fine — Google recommends SPA pageviews fire on route change anyway.

- [ ] **Step 1: Remove all analytics code from `_document.js`**

Replace `src/pages/_document.js`:

```javascript
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { augmentDocumentWithEmotionCache } from "./_app";
import theme from "../components/theme/default";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href="/cyverse_whitelogo.png"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

augmentDocumentWithEmotionCache(MyDocument);

export default MyDocument;
```

- [ ] **Step 2: Add dynamic GA script loading to `_app.js`**

In `_app.js`, add a `useEffect` that loads gtag dynamically once config is available. Add this inside the `MyApp` component, after the config fetch `useEffect` (from Task 3):

```javascript
useEffect(() => {
    if (!config?.analytics?.enabled || !config?.analytics?.id) return;

    const analyticsId = config.analytics.id;

    // Load gtag.js dynamically
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", analyticsId, {
        page_path: window.location.pathname,
    });
}, [config?.analytics?.enabled, config?.analytics?.id]);
```

Also update the route-change analytics `useEffect` to use `window.gtag` directly instead of the imported `gtag` module:

```javascript
useEffect(() => {
    if (!config?.analytics?.id) return;

    const handleRouteChange = (url) => {
        if (window.gtag) {
            window.gtag("event", "page_view", {
                page_path: url,
            });
        }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
    };
}, [config?.analytics?.id, router.events]);
```

- [ ] **Step 3: Replace `reportWebVitals` with `useReportWebVitals` hook**

In `_app.js`:
- Remove `import * as gtag from "../gtag";`
- Remove the entire `export function reportWebVitals(...)` function (removed in Next.js 16)
- Add the `useReportWebVitals` hook import and call inside `MyApp`:

```javascript
import { useReportWebVitals } from "next/web-vitals";
```

Inside the `MyApp` component body:

```javascript
useReportWebVitals((metric) => {
    if (!config?.analytics?.enabled || !window.gtag) return;

    console.log(
        "Logging event id=>" +
            metric.id +
            " name=>" +
            metric.name +
            " label" +
            metric.label +
            " value=>" +
            metric.value
    );
    window.gtag("event", metric.name, {
        event_category:
            metric.label === "web-vital"
                ? "Web Vitals"
                : "Next.js custom metric",
        value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
    });
});
```

If `src/gtag.js` is no longer imported anywhere else, delete it.

- [ ] **Step 4: Verify build**

```bash
npm run build-frontend 2>&1 | head -50
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/_document.js src/pages/_app.js
git rm src/gtag.js 2>/dev/null; true
git commit -m "CORE-2123 Move analytics to client-side dynamic loading in _app.js"
```

---

### Task 5: Upgrade companion packages

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: Compatible versions of `@next/bundle-analyzer`, `eslint-config-next`, `react-test-renderer` removal

- [ ] **Step 1: Upgrade `@next/bundle-analyzer` to match Next.js 16**

```bash
npm install @next/bundle-analyzer@latest
```

- [ ] **Step 2: Upgrade `eslint-config-next` to match Next.js 16**

```bash
npm install --save-dev eslint-config-next@latest
```

- [ ] **Step 3: Remove `react-test-renderer` (removed in React 19)**

```bash
npm uninstall react-test-renderer
```

- [ ] **Step 4: Install `@testing-library/react` for test migration (Task 7)**

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 5: Remove `react-is` dependency and override (merged into React 19)**

Check if anything directly imports `react-is`:
```bash
grep -rn "from ['\"]react-is" src/ --include="*.js"
```

If nothing imports it directly, remove from `dependencies` and `overrides` in `package.json`.

```bash
npm uninstall react-is
```

Then remove the `overrides` section from `package.json` if `react-is` was the only entry.

- [ ] **Step 6: Remove `jest-next-dynamic` (likely incompatible with Next.js 16)**

```bash
npm uninstall jest-next-dynamic
```

- [ ] **Step 7: Verify dependencies resolve**

```bash
npm install
```

Expected: No peer dependency conflicts. If there are conflicts, note them for resolution.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json
git commit -m "CORE-2123 Upgrade companion packages for Next.js 16 compatibility"
```

---

### Task 6: Fix React 19 `defaultProps` deprecation

**Files:**
- Modify: `src/components/rating/Rate.js`
- Modify: `src/components/table/EnhancedTableHead.js`
- Modify: `src/components/searchField/SearchField.js`
- Modify: `src/components/copy/CopyTextArea.js`
- Modify: `src/components/apps/savedLaunch/SavedLaunch.js`

**Interfaces:**
- Produces: Components using default parameter values instead of `defaultProps`

For each file, convert the `ComponentName.defaultProps = { ... }` pattern to default parameter destructuring in the component function signature.

- [ ] **Step 1: Fix `Rate.js`**

Find the component function signature and its `defaultProps`. Change from:

```javascript
function Rate(props) {
    const { name, value, ... } = props;
    ...
}
Rate.defaultProps = {
    name: "",
    value: 0,
    ...
};
```

To:

```javascript
function Rate({ name = "", value = 0, ...otherProps }) {
    ...
}
// Remove Rate.defaultProps entirely
```

Read the file first to see exact props, then apply the conversion.

- [ ] **Step 2: Fix `EnhancedTableHead.js`**

Same pattern — move defaults into destructuring, remove `.defaultProps`.

- [ ] **Step 3: Fix `SearchField.js`**

Same pattern.

- [ ] **Step 4: Fix `CopyTextArea.js`**

Same pattern.

- [ ] **Step 5: Fix `SavedLaunch.js`**

Same pattern.

- [ ] **Step 6: Verify lint passes**

```bash
npm run lint 2>&1 | tail -20
```

Expected: 0 warnings, 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/rating/Rate.js src/components/table/EnhancedTableHead.js src/components/searchField/SearchField.js src/components/copy/CopyTextArea.js src/components/apps/savedLaunch/SavedLaunch.js
git commit -m "CORE-2123 Replace defaultProps with default parameters for React 19"
```

---

### Task 7: Migrate tests from `react-test-renderer` to `@testing-library/react`

**Files:**
- Modify: All 17 test files in `src/__tests__/` that use `react-test-renderer`
- Modify: `src/__tests__/layout.js` (also remove `jest-next-dynamic`)
- Modify: `src/__tests__/data.js` (also remove `jest-next-dynamic`)

**Interfaces:**
- Consumes: `@testing-library/react` (installed in Task 5)
- Produces: Working test suite using `render` from `@testing-library/react`

The current test pattern is:
```javascript
import TestRenderer from "react-test-renderer";
const component = TestRenderer.create(<Component />);
component.unmount();
```

The replacement pattern:
```javascript
import { render } from "@testing-library/react";
const { unmount } = render(<Component />);
unmount();
```

- [ ] **Step 1: Create a test setup file for `@testing-library/jest-dom`**

Create `src/__tests__/setup.js`:

```javascript
import "@testing-library/jest-dom";
```

Add to `jest` config in `package.json`:

```json
"jest": {
    ...existing config...,
    "setupFilesAfterEnv": ["<rootDir>/src/__tests__/setup.js"]
}
```

- [ ] **Step 2: Migrate each test file**

For each of the 17 files, apply this transformation:

Replace:
```javascript
import renderer from "react-test-renderer";
// or
import TestRenderer from "react-test-renderer";
```

With:
```javascript
import { render } from "@testing-library/react";
```

Replace:
```javascript
const component = renderer.create(<Component />);
component.unmount();
// or
const component = TestRenderer.create(<Component />);
component.unmount();
```

With:
```javascript
const { unmount } = render(<Component />);
unmount();
```

Files to migrate:
1. `src/__tests__/subscriptions.js`
2. `src/__tests__/metadata.js`
3. `src/__tests__/tools.js`
4. `src/__tests__/data.js`
5. `src/__tests__/vice/instantLaunches.js`
6. `src/__tests__/apps.js`
7. `src/__tests__/teams.js`
8. `src/__tests__/analyses.js`
9. `src/__tests__/notifications.js`
10. `src/__tests__/collections.js`
11. `src/__tests__/globalSearch.js`
12. `src/__tests__/addons.js`
13. `src/__tests__/layout.js`
14. `src/__tests__/dataSearch.js`
15. `src/__tests__/apps/workflows.js`
16. `src/__tests__/apps/editor.js`
17. `src/__tests__/apps/launch.js`

- [ ] **Step 3: Remove `jest-next-dynamic` usage**

In `src/__tests__/layout.js` and `src/__tests__/data.js`, remove:
```javascript
import preloadAll from "jest-next-dynamic";
// and the call:
await preloadAll();
```

If the tests need dynamic imports to resolve, use Jest's built-in `jest.mock` for the dynamic components, or simply remove the `preloadAll` call and see if tests still pass (Next.js 16 dynamic imports may resolve differently in test environments).

- [ ] **Step 4: Run the test suite**

```bash
TZ=UTC npx jest 2>&1 | tail -30
```

Expected: All tests pass. If some fail due to missing dynamic component resolution, mock those components.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/ package.json
git commit -m "CORE-2123 Migrate from react-test-renderer to @testing-library/react"
```

---

### Task 8: Fix remaining build and lint issues

**Files:**
- Potentially modify: `package.json` (jest config, eslint config)
- Potentially modify: `next.config.js`
- Potentially modify: various source files

**Interfaces:**
- Consumes: All changes from Tasks 1–7

This is a catch-all task for issues revealed by the build after all major changes are applied.

- [ ] **Step 1: Run the full build**

```bash
npm run build-frontend 2>&1 | tee /tmp/build-output.txt
```

If errors, read the output and fix each one.

- [ ] **Step 2: Run lint**

```bash
npm run lint 2>&1 | tee /tmp/lint-output.txt
```

Fix any new warnings/errors introduced by the upgrade.

- [ ] **Step 3: Run tests**

```bash
TZ=UTC npx jest 2>&1 | tee /tmp/test-output.txt
```

Fix any remaining test failures.

- [ ] **Step 4: Check if Turbopack works for dev (informational)**

```bash
npm run dev
```

If the dev server fails to start with Turbopack (now default), add `--webpack` flag to the dev script in `package.json`:

```json
"dev-server": "cross-env NODE_ENV=development babel-node ./src/server/"
```

Note: Since this app uses a custom Express server with `babel-node`, the `next dev` command isn't used directly — the custom server calls `next({ dev: true })`. Turbopack should work transparently in this mode.

- [ ] **Step 5: Verify `next-i18next` compatibility**

`next-i18next@15.2.0` should be compatible with Next.js 16 Pages Router. If it throws errors, check for a newer version:

```bash
npm info next-i18next versions | tail -5
```

Upgrade if needed.

- [ ] **Step 6: Verify `tss-react` SSR compatibility**

The `createEmotionSsrAdvancedApproach` from `tss-react/next/pagesDir` should continue to work. If it doesn't, check `tss-react` changelog for React 19 / Next.js 16 compatibility.

- [ ] **Step 7: Commit all fixes**

```bash
git add -A
git commit -m "CORE-2123 Resolve remaining build/lint/test issues after Next.js 16 upgrade"
```

---

### Task 9: Smoke test and final verification

**Files:**
- No new file changes expected

**Interfaces:**
- Consumes: Fully upgraded and building application

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Verify the server starts without errors.

- [ ] **Step 2: Test key pages in browser**

Navigate to:
- `http://localhost:3000/` (should redirect to `/dashboard`)
- `http://localhost:3000/apps`
- `http://localhost:3000/data`
- `http://localhost:3000/tools`

Verify pages render without JavaScript errors in the browser console.

- [ ] **Step 3: Verify config loading**

In browser dev tools Network tab, confirm that `GET /api/config` returns a JSON response with the expected config structure.

- [ ] **Step 4: Run the full check suite**

```bash
npm run check
```

Expected: Format check passes, lint passes (0 warnings), all tests pass.

- [ ] **Step 5: Run Storybook (optional sanity check)**

```bash
npm run storybook
```

Verify stories load. If Storybook has React 19 issues, note them but don't block the upgrade — `@storybook/nextjs@8.6` may need an upgrade to support React 19 fully.

- [ ] **Step 6: Final commit if any adjustments needed**

```bash
git status
# If clean, nothing to commit
# If changes, commit them:
git add -A
git commit -m "CORE-2123 Final adjustments from smoke testing"
```

---

## Notes

### Things NOT changed (intentionally)

- **Pages Router stays** — no migration to App Router
- **Custom Express server stays** — no changes to BFF pattern
- **`@tanstack/react-query` v4 stays** — upgrading to v5 is a separate effort
- **`tss-react` / `makeStyles` stay** — 233 usages; migrating to `sx` is separate
- **`formik` stays** — no React 19 incompatibility known
- **`date-fns` v2 stays** — no Next.js 16 dependency

### Potential Issues

1. **`tss-react` + React 19 SSR** — `tss-react@4.9.4` supports React 18. Check if it works with React 19. If not, may need upgrade.
2. **`@storybook/nextjs@8.6`** — May not fully support React 19. Storybook 9 has better React 19 support.
3. **`next-i18next` with Next.js 16** — Pages Router i18n (`i18n` key in `next.config.js`) should still work in 16 but verify.
4. **`animated-number-react`** — Tiny package, may use deprecated React APIs. Test at runtime.
5. **`react-joyride`** — Check React 19 compatibility.
