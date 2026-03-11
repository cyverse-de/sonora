# Ingress to Gateway API Migration Design

## Overview

Migrate the VICE admin and loading pages from Kubernetes Ingress API to Gateway API. The backend API response field changes from `ingresses` to `routes` (HTTPRoute objects).

## API Change

**Before:**
```javascript
{ deployments, pods, configMaps, services, ingresses }
```

**After:**
```javascript
{ deployments, pods, configMaps, services, routes }
```

## UI Terminology

- Tab label: "HTTP Routes"
- Status messages: "HTTP Route - Complete" / "HTTP Route - Pending"

## Files to Modify

### Components (9 files)

| File | Changes |
|------|---------|
| `src/components/vice/loading/index.js` | `ingresses` → `routes`, `ingressesDone` → `routesDone` |
| `src/components/vice/loading/Toolbar.js` | `ingresses` prop → `routes` |
| `src/components/vice/loading/DetailsContent.js` | `ingresses` prop → `routes`, use `httpRouteComplete`/`httpRoutePending` keys |
| `src/components/vice/loading/ContactSupportDialog.js` | `ingresses` prop → `routes`, `ingressDone` → `httpRouteDone` |
| `src/components/vice/admin/tabs/index.js` | `"ingresses"` → `"httpRoutes"` in `orderOfTabs` |
| `src/components/vice/admin/tabs/columns.js` | `ingresses` key → `httpRoutes` |
| `src/components/vice/admin/filter/efcs.js` | `ingresses` → `httpRoutes` |
| `src/components/vice/admin/filter/ids.js` | `INGRESS` → `HTTP_ROUTE`, field IDs updated |
| `src/components/vice/admin/constants.js` | `INGRESS_COLUMNS` → `HTTP_ROUTE_COLUMNS` |

### Localization (2 files)

| File | Changes |
|------|---------|
| `public/static/locales/en/vice-loading.json` | `ingressComplete`/`ingressPending` → `httpRouteComplete`/`httpRoutePending` with "HTTP Route" text |
| `public/static/locales/en/vice-admin.json` | `"ingresses": "Ingresses"` → `"httpRoutes": "HTTP Routes"` |

### Stories (3 files)

| File | Changes |
|------|---------|
| `stories/vice/loading/ViceLoading.stories.js` | `ingressComplete` → `httpRouteComplete` |
| `stories/vice/loading/ViceLoadingMocks.js` | `ingressComplete` → `httpRouteComplete`, `ingresses` → `routes` |
| `stories/vice/admin/mocks.js` | `ingresses` → `routes` |

### Tests (2 files)

| File | Changes |
|------|---------|
| `src/__tests__/vice/admin/filter/test_data.js` | `ingresses` → `routes` |
| `src/__tests__/vice/admin/filter/efcs.js` | `result.ingresses` → `result.routes`, `data.ingresses` → `data.routes` |

## Data Flow

No changes to data flow logic. The transformation is purely a field rename:

```
API Response: { ..., routes: [...] }
                     ↓
Component State: destructures `routes` instead of `ingresses`
                     ↓
Progress Check: `routesDone = routes?.length > 0`
                     ↓
UI Display: Uses `httpRouteComplete`/`httpRoutePending` localization keys
```

## Notes

- The HTTPRoute model differs from the Ingress model, but since the code only checks `length > 0` for progress and uses common fields (username, analysisName, etc.) in the admin table, this doesn't affect the current implementation.
- If HTTPRoute-specific fields need to be displayed later, that would be a separate enhancement.

## Testing Strategy

1. Run existing tests to ensure they pass with the renamed fields
2. Verify Storybook stories render correctly with the new mock data
3. Manual verification that the VICE loading page shows "HTTP Route - Complete/Pending" status

## Risk Assessment

- **Risk Level:** Low
- **Rationale:** Straightforward field rename with no logic changes
- **Breaking Change:** Yes—requires the backend API to return `routes` instead of `ingresses`
