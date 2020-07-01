/**
 * @author sriram
 *
 */
import callApi from "../common/callApi";
import appType from "../components/models/AppType";

const ALL_APPS_QUERY_KEY = "fetchAllApps";
const APP_DETAILS_QUERY_KEY = "fetchAppDetails";
const APPS_IN_CATEGORY_QUERY_KEY = "fetchAppsInCategory";
const APP_DESCRIPTION_QUERY_KEY = "fetchAppDescription";

const getAppTypeFilter = (appTypeFilter) => {
    const typeFilter =
        appTypeFilter && appTypeFilter !== appType.all
            ? "&app-type=" + appTypeFilter
            : "";
    return typeFilter;
};

function getApps(key, { rowsPerPage, orderBy, order, page, appTypeFilter }) {
    return callApi({
        endpoint: `/api/apps?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }${getAppTypeFilter(appTypeFilter)}`,
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
        endpoint: `/api/apps/categories/${systemId}/${categoryId}?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }${getAppTypeFilter(appTypeFilter)}`,
        method: "GET",
    });
}

function getAppDescription(_, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}`,
        method: "GET",
    });
}

function getAppDetails(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/details`,
        method: "GET",
    });
}

function appFavorite({ isFav, systemId, appId }) {
    if (isFav) {
        return callApi({
            endpoint: `/api/apps/${systemId}/${appId}/favorite`,
            method: "PUT",
        });
    } else {
        return callApi({
            endpoint: `/api/apps/${systemId}/${appId}/favorite`,
            method: "DELETE",
        });
    }
}

function rateApp({ systemId, appId, rating }) {
    if (rating) {
        return callApi({
            endpoint: `/api/apps/${systemId}/${appId}/rating`,
            method: "POST",
            body: {
                rating: rating,
            },
        });
    } else {
        return callApi({
            endpoint: `/api/apps/${systemId}/${appId}/rating`,
            method: "DELETE",
        });
    }
}

export {
    getApps,
    getPrivateCategories,
    getAppsInCategory,
    getAppDescription,
    getAppDetails,
    appFavorite,
    rateApp,
    ALL_APPS_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
    APP_DESCRIPTION_QUERY_KEY,
};
