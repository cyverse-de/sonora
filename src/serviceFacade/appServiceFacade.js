/**
 * @author sriram
 *
 */
import callApi from "../common/callApi";
import appType from "../components/models/AppType";

const getAppTypeFilter = (appTypeFilter) => {
    const typeFilter =
        appTypeFilter && appTypeFilter !== appType.all
            ? "&app-type=" + appTypeFilter
            : "";
    return typeFilter;
};

function getApps(key, { rowsPerPage, orderBy, order, page, appTypeFilter }) {
    return callApi({
        endpoint: `/api/apps?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${rowsPerPage *
            page}${getAppTypeFilter(appTypeFilter)}`,
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
    return callApi({
        endpoint: `/api/apps/categories/${systemId}/${categoryId}?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${rowsPerPage *
            page}${getAppTypeFilter(appTypeFilter)}`,
        method: "GET",
    });
}

function getAppDetails(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/details`,
        method: "GET",
    });
}

function addToFavorite(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/favorite`,
        method: "PUT",
    });
}

function removeFromFavorite(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/favorite`,
        method: "DELETE",
    });
}

function rateApp(key, { systemId, appId, rating }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/rating`,
        method: "POST",
        body: {
            rating: rating,
        },
    });
}

function unRateApp(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/rating`,
        method: "DELETE",
    });
}

export {
    getApps,
    getPrivateCategories,
    getAppsInCategory,
    getAppDetails,
    addToFavorite,
    removeFromFavorite,
    rateApp,
    unRateApp,
};
