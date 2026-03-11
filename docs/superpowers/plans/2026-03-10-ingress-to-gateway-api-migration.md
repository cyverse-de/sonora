# Ingress to Gateway API Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename `ingresses` to `routes` throughout the VICE UI to support the Gateway API migration.

**Architecture:** Pure field rename - change `ingresses` → `routes` in API response handling, update UI labels from "Ingress" to "HTTP Route", update all related tests and stories.

**Tech Stack:** React, Next.js, i18next localization, Jest tests, Storybook

---

## File Structure

**Localization (2 files):**
- `public/static/locales/en/vice-loading.json` - Loading page status messages
- `public/static/locales/en/vice-admin.json` - Admin tab labels

**Admin Components (5 files):**
- `src/components/vice/admin/constants.js` - Column constants
- `src/components/vice/admin/filter/ids.js` - Filter element IDs
- `src/components/vice/admin/filter/efcs.js` - Filter extractors
- `src/components/vice/admin/tabs/columns.js` - Table column definitions
- `src/components/vice/admin/tabs/index.js` - Tab component

**Loading Components (4 files):**
- `src/components/vice/loading/index.js` - Main loading component
- `src/components/vice/loading/Toolbar.js` - Loading toolbar
- `src/components/vice/loading/DetailsContent.js` - Details drawer content
- `src/components/vice/loading/ContactSupportDialog.js` - Support dialog

**Stories (3 files):**
- `stories/vice/loading/ViceLoadingMocks.js` - Loading page mock data
- `stories/vice/loading/ViceLoading.stories.js` - Loading page stories
- `stories/vice/admin/mocks.js` - Admin page mock data

**Tests (2 files):**
- `src/__tests__/vice/admin/filter/test_data.js` - Test fixtures
- `src/__tests__/vice/admin/filter/efcs.js` - Filter tests

---

## Chunk 1: Localization Files

### Task 1: Update vice-loading.json localization

**Files:**
- Modify: `public/static/locales/en/vice-loading.json:23-24`

- [ ] **Step 1: Update localization keys**

Change lines 23-24 from:
```json
"ingressComplete": "Ingress - Complete",
"ingressPending": "Ingress - Pending",
```

To:
```json
"httpRouteComplete": "HTTP Route - Complete",
"httpRoutePending": "HTTP Route - Pending",
```

- [ ] **Step 2: Commit**

```bash
git add public/static/locales/en/vice-loading.json
git commit -m "feat: rename ingress to httpRoute in vice-loading localization"
```

---

### Task 2: Update vice-admin.json localization

**Files:**
- Modify: `public/static/locales/en/vice-admin.json:53`

- [ ] **Step 1: Update localization key**

Change line 53 from:
```json
"ingresses": "Ingresses",
```

To:
```json
"httpRoutes": "HTTP Routes",
```

- [ ] **Step 2: Commit**

```bash
git add public/static/locales/en/vice-admin.json
git commit -m "feat: rename ingresses to httpRoutes in vice-admin localization"
```

---

## Chunk 2: Admin Components

### Task 3: Update admin constants

**Files:**
- Modify: `src/components/vice/admin/constants.js:59-61`

- [ ] **Step 1: Rename INGRESS_COLUMNS to HTTP_ROUTE_COLUMNS**

Change lines 57-61 from:
```javascript
// We'll probably end up adding more columns, so this is getting
// it's own set of constants.
export const INGRESS_COLUMNS = {
    ...COMMON_COLUMNS,
};
```

To:
```javascript
// We'll probably end up adding more columns, so this is getting
// it's own set of constants.
export const HTTP_ROUTE_COLUMNS = {
    ...COMMON_COLUMNS,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vice/admin/constants.js
git commit -m "feat: rename INGRESS_COLUMNS to HTTP_ROUTE_COLUMNS"
```

---

### Task 4: Update admin filter IDs

**Files:**
- Modify: `src/components/vice/admin/filter/ids.js:8,23-24`

- [ ] **Step 1: Rename INGRESS to HTTP_ROUTE and update field IDs**

Change line 8 from:
```javascript
    INGRESS: "ingress",
```

To:
```javascript
    HTTP_ROUTE: "httpRoute",
```

Change lines 23-24 from:
```javascript
    INGRESS_FIELD_SELECT: "ingressFieldSelect",
    INGRESS_FIELD_VALUE: "ingressFieldValue",
```

To:
```javascript
    HTTP_ROUTE_FIELD_SELECT: "httpRouteFieldSelect",
    HTTP_ROUTE_FIELD_VALUE: "httpRouteFieldValue",
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vice/admin/filter/ids.js
git commit -m "feat: rename ingress to httpRoute in filter IDs"
```

---

### Task 5: Update admin filter efcs

**Files:**
- Modify: `src/components/vice/admin/filter/efcs.js:175-177,264`

- [ ] **Step 1: Rename ingresses to httpRoutes**

Change lines 175-177 from:
```javascript
const ingresses = {
    ...common,
};
```

To:
```javascript
const httpRoutes = {
    ...common,
};
```

Change line 264 from:
```javascript
    ingresses,
```

To:
```javascript
    httpRoutes,
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vice/admin/filter/efcs.js
git commit -m "feat: rename ingresses to httpRoutes in filter efcs"
```

---

### Task 6: Update admin tabs columns

**Files:**
- Modify: `src/components/vice/admin/tabs/columns.js:94`

- [ ] **Step 1: Rename ingresses key to httpRoutes**

Change line 94 from:
```javascript
    ingresses: commonColumns,
```

To:
```javascript
    httpRoutes: commonColumns,
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vice/admin/tabs/columns.js
git commit -m "feat: rename ingresses to httpRoutes in columns config"
```

---

### Task 7: Update admin tabs component

**Files:**
- Modify: `src/components/vice/admin/tabs/index.js:149`

- [ ] **Step 1: Rename ingresses to httpRoutes in orderOfTabs**

Change line 149 from:
```javascript
        "ingresses",
```

To:
```javascript
        "httpRoutes",
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vice/admin/tabs/index.js
git commit -m "feat: rename ingresses to httpRoutes in admin tabs"
```

---

## Chunk 3: Loading Components

### Task 8: Update loading index component

**Files:**
- Modify: `src/components/vice/loading/index.js:62,99,125,135,271,296`

- [ ] **Step 1: Update destructuring on line 62**

Change from:
```javascript
    const { deployments, configMaps, services, ingresses, pods } = data;
```

To:
```javascript
    const { deployments, configMaps, services, routes, pods } = data;
```

- [ ] **Step 2: Update routesDone check on line 99**

Change from:
```javascript
        const ingressesDone = ingresses?.length > 0;
```

To:
```javascript
        const routesDone = routes?.length > 0;
```

- [ ] **Step 3: Update condition on line 125**

Change from:
```javascript
                ingressesDone
```

To:
```javascript
                routesDone
```

- [ ] **Step 4: Update progress calculation on line 135**

Change from:
```javascript
                        ingressesDone) *
```

To:
```javascript
                        routesDone) *
```

- [ ] **Step 5: Update useEffect dependency on line 271**

Change from:
```javascript
        ingresses,
```

To:
```javascript
        routes,
```

- [ ] **Step 6: Update prop passed to ViceLoadingToolbar on line 296**

Change from:
```javascript
                ingresses={ingresses}
```

To:
```javascript
                routes={routes}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/vice/loading/index.js
git commit -m "feat: rename ingresses to routes in loading component"
```

---

### Task 9: Update loading Toolbar component

**Files:**
- Modify: `src/components/vice/loading/Toolbar.js:30,80,99`

- [ ] **Step 1: Update prop destructuring on line 30**

Change from:
```javascript
        ingresses,
```

To:
```javascript
        routes,
```

- [ ] **Step 2: Update prop passed to ContactSupportDialog on line 80**

Change from:
```javascript
                ingresses={ingresses}
```

To:
```javascript
                routes={routes}
```

- [ ] **Step 3: Update prop passed to DetailsContent on line 99**

Change from:
```javascript
                    ingresses={ingresses}
```

To:
```javascript
                    routes={routes}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/vice/loading/Toolbar.js
git commit -m "feat: rename ingresses to routes in loading toolbar"
```

---

### Task 10: Update DetailsContent component

**Files:**
- Modify: `src/components/vice/loading/DetailsContent.js:110,124-126`

- [ ] **Step 1: Update prop destructuring on line 110**

Change from:
```javascript
    const { deployments, configMaps, services, ingresses, pods } = props;
```

To:
```javascript
    const { deployments, configMaps, services, routes, pods } = props;
```

- [ ] **Step 2: Update Typography on lines 123-127**

Change from:
```javascript
            <Typography variant="h6">
                {ingresses?.length > 0
                    ? t("ingressComplete")
                    : t("ingressPending")}
            </Typography>
```

To:
```javascript
            <Typography variant="h6">
                {routes?.length > 0
                    ? t("httpRouteComplete")
                    : t("httpRoutePending")}
            </Typography>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/vice/loading/DetailsContent.js
git commit -m "feat: rename ingresses to routes in DetailsContent"
```

---

### Task 11: Update ContactSupportDialog component

**Files:**
- Modify: `src/components/vice/loading/ContactSupportDialog.js:36,114,180`

- [ ] **Step 1: Update prop destructuring on line 36**

Change from:
```javascript
        ingresses,
```

To:
```javascript
        routes,
```

- [ ] **Step 2: Update support request field on line 114**

Change from:
```javascript
                ingressDone: ingresses?.length > 0,
```

To:
```javascript
                httpRouteDone: routes?.length > 0,
```

- [ ] **Step 3: Update prop passed to DetailsContent on line 180**

Change from:
```javascript
                        ingresses={ingresses}
```

To:
```javascript
                        routes={routes}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/vice/loading/ContactSupportDialog.js
git commit -m "feat: rename ingresses to routes in ContactSupportDialog"
```

---

## Chunk 4: Stories and Mocks

### Task 12: Update ViceLoadingMocks

**Files:**
- Modify: `stories/vice/loading/ViceLoadingMocks.js:16,278`

- [ ] **Step 1: Update function parameter on line 16**

Change from:
```javascript
    ingressComplete,
```

To:
```javascript
    httpRouteComplete,
```

- [ ] **Step 2: Update ingresses field on line 278**

Change from:
```javascript
        ingresses: ingressComplete
```

To:
```javascript
        routes: httpRouteComplete
```

- [ ] **Step 3: Commit**

```bash
git add stories/vice/loading/ViceLoadingMocks.js
git commit -m "feat: rename ingress to httpRoute in loading mocks"
```

---

### Task 13: Update ViceLoading.stories.js

**Files:**
- Modify: `stories/vice/loading/ViceLoading.stories.js:11,33,86-89,134`

- [ ] **Step 1: Update component prop on line 11**

Change from:
```javascript
    ingressComplete,
```

To:
```javascript
    httpRouteComplete,
```

- [ ] **Step 2: Update mock call on line 33**

Change from:
```javascript
                      ingressComplete,
```

To:
```javascript
                      httpRouteComplete,
```

- [ ] **Step 3: Update argTypes on lines 86-89**

Change from:
```javascript
    ingressComplete: {
        control: {
            type: "boolean",
        },
    },
```

To:
```javascript
    httpRouteComplete: {
        control: {
            type: "boolean",
        },
    },
```

- [ ] **Step 4: Update args on line 134**

Change from:
```javascript
    ingressComplete: true,
```

To:
```javascript
    httpRouteComplete: true,
```

- [ ] **Step 5: Commit**

```bash
git add stories/vice/loading/ViceLoading.stories.js
git commit -m "feat: rename ingressComplete to httpRouteComplete in stories"
```

---

### Task 14: Update admin mocks

**Files:**
- Modify: `stories/vice/admin/mocks.js:922`

- [ ] **Step 1: Rename ingresses to routes**

Change line 922 from:
```javascript
    ingresses: [
```

To:
```javascript
    routes: [
```

- [ ] **Step 2: Commit**

```bash
git add stories/vice/admin/mocks.js
git commit -m "feat: rename ingresses to routes in admin mocks"
```

---

## Chunk 5: Tests

### Task 15: Update test_data.js

**Files:**
- Modify: `src/__tests__/vice/admin/filter/test_data.js:663`

- [ ] **Step 1: Rename ingresses to routes**

Change line 663 from:
```javascript
    ingresses: [
```

To:
```javascript
    routes: [
```

- [ ] **Step 2: Commit**

```bash
git add src/__tests__/vice/admin/filter/test_data.js
git commit -m "feat: rename ingresses to routes in test data"
```

---

### Task 16: Update efcs.js tests

**Files:**
- Modify: `src/__tests__/vice/admin/filter/efcs.js` (multiple lines)

- [ ] **Step 1: Replace all occurrences of ingresses with routes**

Use find/replace to change all instances:
- `result.ingresses` → `result.routes`
- `data.ingresses` → `data.routes`

There are approximately 60+ occurrences throughout the file.

- [ ] **Step 2: Run tests to verify**

```bash
npm test -- --testPathPattern="vice/admin/filter" --watchAll=false
```

Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/vice/admin/filter/efcs.js
git commit -m "feat: rename ingresses to routes in filter tests"
```

---

## Chunk 6: Final Verification

### Task 17: Run all tests

- [ ] **Step 1: Run the full test suite**

```bash
npm test -- --watchAll=false
```

Expected: All tests pass

- [ ] **Step 2: Run linting**

```bash
npm run lint
```

Expected: No errors

---

### Task 18: Verify Storybook

- [ ] **Step 1: Start Storybook and verify stories render**

```bash
npm run storybook
```

Navigate to Vice/Loading and Vice/Admin stories and verify they render correctly with the new controls.

---

### Task 19: Final commit (if any fixes needed)

- [ ] **Step 1: If any fixes were needed, commit them**

```bash
git add -A
git commit -m "fix: address test/lint issues from ingress to routes migration"
```
