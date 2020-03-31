/**
 * @author sriram
 *
 */
import callApi from "../common/callApi";
import appType from "../components/models/AppType";

function getApps(key, { rowsPerPage, orderBy, order, page }) {
    return callApi({
        endpoint: `/api/apps?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${rowsPerPage *
            page}`,
        method: "GET",
    });
}

function getPrivateCategories(key) {
    return callApi({
        endpoint: "/api/apps/categories?public=false",
        method: "GET",
    });
}

function getAppsInCategory(
    key,
    { systemId, categoryId, rowsPerPage, orderBy, order, page, appTypeFilter }
) {
    const typeFilter =
        appTypeFilter && appTypeFilter !== appType.all
            ? "&app-type=" + appTypeFilter
            : "";
    return callApi({
        endpoint: `/api/apps/categories/${systemId}/${categoryId}?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${rowsPerPage *
            page}${typeFilter}`,
        method: "GET",
    });
}

export { getApps, getPrivateCategories, getAppsInCategory };
