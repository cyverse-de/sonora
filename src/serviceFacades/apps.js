/**
 * @author sriram
 *
 */
import callApi from "../common/callApi";
import appType from "../components/models/AppType";
import constants from "../constants";

const ALL_APPS_QUERY_KEY = "fetchAllApps";
const APP_DETAILS_QUERY_KEY = "fetchAppDetails";
const APPS_IN_CATEGORY_QUERY_KEY = "fetchAppsInCategory";
const APP_DESCRIPTION_QUERY_KEY = "fetchAppDescription";
const APP_CATEGORIES_QUERY_KEY = "fetchPrivateCategories";
const APPS_SEARCH_QUERY_KEY = "searchApps";
const APP_BY_ID_QUERY_KEY = "fetchAppById";
const APP_DOC_QUERY_KEY = "fetchAppDoc";

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

function getAppById(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/listing`,
        method: "GET",
    });
}

function getPrivateCategories(key, userId) {
    return userId
        ? callApi({
              endpoint: "/api/apps/categories?public=false",
              method: "GET",
          })
        : Promise.resolve({
              categories: [
                  {
                      system_id: "de",
                      name: "Workspace",
                      categories: [
                          {
                              system_id: "de",
                              id: constants.APPS_UNDER_DEV, // fake ID for anon user
                              name: constants.APPS_UNDER_DEV,
                          },
                          {
                              system_id: "de",
                              id: constants.FAV_APPS, // fake ID for anon user
                              name: constants.FAV_APPS,
                          },
                          {
                              system_id: "de",
                              id: "00000000-0000-0000-0000-000000000000",
                              name: constants.MY_PUBLIC_APPS,
                          },
                          {
                              system_id: "de",
                              id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
                              name: constants.APPS_SHARED_WITH_ME,
                          },
                      ],
                  },
                  {
                      system_id: constants.AGAVE_SYSTEM_ID,
                      id: "00000000-0000-0000-0000-000000000001",
                      name: constants.HPC,
                  },
              ],
          });
}

function getAppsInCategory(
    key,
    {
        systemId,
        categoryId,
        rowsPerPage,
        orderBy,
        order,
        page,
        appTypeFilter,
        userId,
    }
) {
    return userId
        ? callApi({
              endpoint: `/api/apps/categories/${systemId}/${categoryId}?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
                  rowsPerPage * page
              }${getAppTypeFilter(appTypeFilter)}`,
              method: "GET",
          })
        : Promise.reject({
              response: {
                  status: 401,
              },
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

function searchApps(key, { search, rowsPerPage, orderBy, order, page }) {
    return callApi({
        endpoint: `/api/apps?search=${search}&limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }`,
        method: "GET",
    });
}

/**
 * Search Apps
 * @param {string} key - react-query key
 * @param {object} param - parameters for searching apps.
 * @param {integer} page - the page to retrieve. The last parameter must be the page number as required by react-query useInfiniteQuery.
 */
function searchAppsInfiniteQuery(
    key,
    { search, rowsPerPage, orderBy, order },
    page = 0
) {
    return callApi({
        endpoint: `/api/apps?search=${search}&limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }`,
        method: "GET",
    });
}

function getAppPermissions({ apps }) {
    return callApi({
        endpoint: `/api/apps/permission-lister`,
        method: "POST",
        body: {
            apps,
        },
    });
}

function getAppDoc(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/documentation`,
        method: "GET",
    });
}

function saveAppDoc({ systemId, appId, documentation }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/documentation`,
        method: "PATCH",
        body: { documentation },
    });
}

export {
    getApps,
    getAppById,
    getPrivateCategories,
    getAppsInCategory,
    getAppDescription,
    getAppDetails,
    getAppPermissions,
    appFavorite,
    rateApp,
    searchApps,
    searchAppsInfiniteQuery,
    getAppDoc,
    saveAppDoc,
    ALL_APPS_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
    APP_DESCRIPTION_QUERY_KEY,
    APP_CATEGORIES_QUERY_KEY,
    APPS_SEARCH_QUERY_KEY,
    APP_BY_ID_QUERY_KEY,
    APP_DOC_QUERY_KEY,
};
