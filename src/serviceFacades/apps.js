/**
 * @author sriram, psarando
 *
 */
import callApi from "../common/callApi";
import appType from "../components/models/AppType";
import constants from "../constants";
import {
    betaAVU,
    blessedAVU,
    removeAVUs,
    BETA_ATTR,
    BLESSED_ATTR,
} from "components/apps/admin/avuUtils";

const ALL_APPS_QUERY_KEY = "fetchAllApps";
const APP_DETAILS_QUERY_KEY = "fetchAppDetails";
const APPS_IN_CATEGORY_QUERY_KEY = "fetchAppsInCategory";
const APP_DESCRIPTION_QUERY_KEY = "fetchAppDescription";
const APP_CATEGORIES_QUERY_KEY = "fetchPrivateCategories";
const APPS_SEARCH_QUERY_KEY = "searchApps";
const APP_BY_ID_QUERY_KEY = "fetchAppById";
const APP_DOC_QUERY_KEY = "fetchAppDoc";
const APP_ELEMENT_INFO_TYPES_QUERY_KEY = "fetchAppElementInfoTypes";
const APP_UI_QUERY_KEY = "fetchAppUI";
const APP_PUBLICATION_REQUESTS_QUERY_KEY = "fetchPublicationRequests";

//ADMIN KEYS
const ADMIN_APPS_QUERY_KEY = "fetchAllAppsForAdmin";
const ADMIN_APP_DETAILS_QUERY_KEY = "fetchAppDetailsForAdmin";
const ADMIN_APP_AVU_QUERY_KEY = "fetchAppAVUs";

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

function getAppElementInfoTypes(_) {
    return callApi({
        endpoint: "/api/apps/elements/info-types",
        method: "GET",
    });
}

function addApp({ systemId, app }) {
    return callApi({
        endpoint: `/api/apps/${systemId}`,
        method: "POST",
        body: app,
    });
}

function getAppDescription(_, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}`,
        method: "GET",
    });
}

function updateApp({ systemId, appId, app }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}`,
        method: "PUT",
        body: app,
    });
}

function updateAppLabels({ systemId, appId, app }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}`,
        method: "PATCH",
        body: app,
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

function getAppUI(_, { systemId, appId }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/ui`,
        method: "GET",
    });
}

// start of admin end-points
function getAppsForAdmin(
    key,
    { rowsPerPage, orderBy, order, page, appTypeFilter }
) {
    return callApi({
        endpoint: `/api/admin/apps?limit=${rowsPerPage}&sort-field=${orderBy}&sort-dir=${order.toUpperCase()}&offset=${
            rowsPerPage * page
        }${getAppTypeFilter(appTypeFilter)}`,
        method: "GET",
    });
}

function getAppDetailsForAdmin(key, { systemId, appId }) {
    return callApi({
        endpoint: `/api/admin/apps/${systemId}/${appId}/details`,
        method: "GET",
    });
}

function adminPatchApp({
    deleted,
    disabled,
    extra,
    description,
    name,
    id,
    system_id,
}) {
    return callApi({
        endpoint: `/api/admin/apps/${system_id}/${id}`,
        method: "PATCH",
        body: { deleted, disabled, extra, description, name, id },
    });
}

function adminAddAppDoc({ systemId, appId, doc }) {
    return callApi({
        endpoint: `/api/admin/apps/${systemId}/${appId}/documentation`,
        method: "POST",
        body: { documentation: doc },
    });
}

function adminUpdateAppDoc({ systemId, appId, doc }) {
    return callApi({
        endpoint: `/api/admin/apps/${systemId}/${appId}/documentation`,
        method: "PATCH",
        body: { documentation: doc },
    });
}

function adminGetAppAVUs(key, { appId }) {
    return callApi({
        endpoint: `/api/admin/apps/${appId}/metadata`,
        method: "GET",
    });
}

function adminSetAppAVUs({ appId, avus }) {
    return callApi({
        endpoint: `/api/admin/apps/${appId}/metadata`,
        method: "PUT",
        body: { avus },
    });
}

function adminUpdateAppMetadata({ app, avus, values }) {
    let updatedAVUs = avus?.length > 0 ? [...avus] : [];

    if (app.isBlessed !== values.isBlessed) {
        if (values.isBlessed) {
            updatedAVUs.push(blessedAVU);
        } else {
            updatedAVUs = removeAVUs(updatedAVUs, BLESSED_ATTR);
        }
    }

    if (app.beta !== values.beta) {
        if (values.beta) {
            updatedAVUs.push(betaAVU);
        } else {
            updatedAVUs = removeAVUs(updatedAVUs, BETA_ATTR);
        }
    }

    return adminSetAppAVUs({ avus: updatedAVUs, appId: app.id });
}

function adminUpdateApp({ app, details, avus, values }) {
    const documentation = details?.documentation;
    const promises = [];
    if (app !== values) {
        const {
            deleted,
            disabled,
            description,
            name,
            id,
            system_id,
            extra,
        } = values;
        promises.push(
            adminPatchApp({
                deleted,
                disabled,
                extra,
                description,
                name,
                id,
                system_id,
            })
        );
    }
    if (!documentation?.documentation && values.documentation?.documentation) {
        promises.push(
            adminAddAppDoc({
                systemId: values.system_id,
                appId: values.id,
                doc: values.documentation.documentation,
            })
        );
    } else if (
        documentation?.documentation !== values.documentation?.documentation
    ) {
        promises.push(
            adminUpdateAppDoc({
                systemId: values.system_id,
                appId: values.id,
                doc: values.documentation?.documentation,
            })
        );
    }

    return Promise.all(promises);
}

function requestToPublishApp({ systemId, appId, request }) {
    return callApi({
        endpoint: `/api/apps/${systemId}/${appId}/publish`,
        method: "POST",
        body: request,
    });
}

function getAppPublicationRequests(key) {
    return callApi({
        endpoint: `/api/admin/apps/publication-requests`,
        method: "GET",
    });
}

function adminPublishApp({ appId, systemId }) {
    return callApi({
        endpoint: `/api/admin/apps/${systemId}/${appId}/publish`,
        method: "POST",
        body: {},
    });
}

export {
    addApp,
    getApps,
    getAppsForAdmin,
    getAppDetailsForAdmin,
    getAppById,
    getPrivateCategories,
    getAppsInCategory,
    getAppDescription,
    getAppDetails,
    getAppElementInfoTypes,
    getAppPermissions,
    getAppUI,
    appFavorite,
    rateApp,
    updateApp,
    updateAppLabels,
    searchApps,
    searchAppsInfiniteQuery,
    getAppDoc,
    saveAppDoc,
    adminGetAppAVUs,
    adminUpdateApp,
    adminUpdateAppMetadata,
    getAppPublicationRequests,
    adminPublishApp,
    requestToPublishApp,
    ALL_APPS_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
    APP_DESCRIPTION_QUERY_KEY,
    APP_CATEGORIES_QUERY_KEY,
    APPS_SEARCH_QUERY_KEY,
    APP_BY_ID_QUERY_KEY,
    APP_DOC_QUERY_KEY,
    APP_ELEMENT_INFO_TYPES_QUERY_KEY,
    APP_UI_QUERY_KEY,
    ADMIN_APPS_QUERY_KEY,
    ADMIN_APP_DETAILS_QUERY_KEY,
    ADMIN_APP_AVU_QUERY_KEY,
    APP_PUBLICATION_REQUESTS_QUERY_KEY,
};
