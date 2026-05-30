# sonora project guidelines

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sonora is the UI for the CyVerse Discovery Environment, a scientific research platform. It's a Next.js (Pages Router) application with a custom Express server, using React 18 and MUI v6.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (eslint, zero warnings allowed)
- **Format:** `npm run format` (prettier)
- **Check all:** `npm run check` (format + lint + tests)
- **Tests:** `TZ=UTC jest` or `npm test`
- **Single test:** `TZ=UTC npx jest src/__tests__/apps.js`
- **Storybook:** `npm run storybook` (port 9009)

## Architecture

### Client-Server Boundary

The Express server (`src/server/`) acts as a BFF (Backend for Frontend) that proxies API calls to **Terrain** (the CyVerse backend service). Authentication is handled via Keycloak (OpenID Connect). The server also handles file uploads/downloads and WebSocket notifications.

Client-side code calls `/api/*` endpoints which the Express server routes to Terrain. The proxy logic lives in `src/server/api/terrain.js`.

### Data Fetching Pattern

Components use **@tanstack/react-query v4** for server state. The pattern:

1. `src/serviceFacades/*.js` — define query keys and API call functions (using `callApi` from `src/common/callApi.js`)
2. Components import query keys and functions, then use `useQuery`/`useMutation` hooks directly

### Module Resolution

`jsconfig.json` sets `baseUrl: "./src"`, so imports resolve relative to `src/`. For example: `import NavigationConstants from "common/NavigationConstants"` resolves to `src/common/NavigationConstants.js`.

### Key Directories

- `src/pages/` — Next.js pages (routes)
- `src/components/` — React components organized by feature domain
- `src/serviceFacades/` — API query keys and fetch functions (client-side)
- `src/server/api/` — Express route handlers that proxy to Terrain
- `src/contexts/` — React context providers (config, user profile, notifications, etc.)
- `src/components/models/` — Enums and constants for domain types
- `src/common/` — Shared utilities (callApi, navigation constants, axios instance)
- `stories/` — Storybook stories (separate from `src/`)
- `public/static/locales/en/` — i18n translation JSON files
- `config/` — Server configuration (node-config YAML files)

### Styling

Legacy components use **tss-react/mui** (`makeStyles`) for component styles, with component-specific styles in a `styles.js` file alongside the component, though now the `sx` prop is preferred. The CyVerse theme is defined in `src/components/theme/default/`.

### Internationalization

All user-facing text uses **next-i18next**. Translation files live in `public/static/locales/en/*.json`. Import `useTranslation` from the local `i18n` module (not directly from `next-i18next`):

```js
import { useTranslation } from "i18n";
const { t } = useTranslation("namespace");
```

### Testing

Tests in `src/__tests__/` render Storybook stories and create snapshots. Tests depend on mock data defined alongside stories in `stories/`.

### Static IDs

Components use hierarchical IDs for QA testing (`parentId.childId.grandchildId`). IDs are defined in per-feature `ids.js` files.

## New Code Guidelines

- Never install new npm packages without asking first.
- Do not modify `package.json` to add dependencies. Run `npm install <package>`.
- Always list proposed packages and wait for explicit confirmation before execution.
- Set styles directly on MUI components with the `sx` prop.
- Build forms with `formik` plus the field components in `components/forms/`
  (`FormTextField`, `FormSwitch`, etc.). Don't hand-roll form state or
  validation wiring.
- Use `components/table/TableLoading` for table loading states so column
  headers stay visible while data loads.
- Keep i18n locale JSON keys (`public/static/locales/**`) sorted
  alphabetically.
