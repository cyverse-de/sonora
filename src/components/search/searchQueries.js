/**
 *
 * @author sriram
 *
 *
 */

import { useQuery, useInfiniteQuery } from "react-query";
import { searchData, searchDataInfinite } from "serviceFacades/filesystem";
import { searchApps, searchAppsInfiniteQuery } from "serviceFacades/apps";
import { getAnalyses, searchAnalysesInfinite } from "serviceFacades/analyses";

/**
 *
 * Data search query
 *
 * @param {object} dataSearchKey
 * @param {boolean} dataSearchQueryEnabled
 * @param {function} successCallback
 *
 * @returns {function}
 */
function useDataSearch(dataSearchKey, dataSearchQueryEnabled, successCallback) {
    return useQuery({
        queryKey: dataSearchKey,
        queryFn: searchData,
        config: {
            enabled: dataSearchQueryEnabled,
            onSuccess: (results) => successCallback(results),
        },
    });
}

/**
 * Apps search query
 *
 * @param {object} appsSearchKey
 * @param {boolean} appsSearchQueryEnabled
 * @param {function} successCallback
 *
 * @returns {function}
 */
function useAppsSearch(appsSearchKey, appsSearchQueryEnabled, successCallback) {
    return useQuery({
        queryKey: appsSearchKey,
        queryFn: searchApps,
        config: {
            enabled: appsSearchQueryEnabled,
            onSuccess: (results) => successCallback(results),
        },
    });
}

/**
 * Analyses search query
 *
 * @param {object} analysesSearchKey
 * @param {booelan} analysesSearchQueryEnabled
 * @param {function} successCallback
 *
 * @returns {function}
 */
function useAnalysesSearch(
    analysesSearchKey,
    analysesSearchQueryEnabled,
    successCallback
) {
    return useQuery({
        queryKey: analysesSearchKey,
        queryFn: getAnalyses,
        config: {
            enabled: analysesSearchQueryEnabled,
            onSuccess: (results) => successCallback(results),
        },
    });
}

/**
 * Analyses infinite load search query
 * @param {object} analysesSearchKey
 * @param {boolean} analysesSearchQueryEnabled
 * @param {function} getFetchMore
 *
 * @returns {function}
 */
function useAnalysesSearchInfinite(
    analysesSearchKey,
    analysesSearchQueryEnabled,
    getFetchMore
) {
    return useInfiniteQuery(analysesSearchKey, searchAnalysesInfinite, {
        enabled: analysesSearchQueryEnabled,
        getFetchMore: getFetchMore,
    });
}

/**
 *
 * Data infinite load search query
 *
 * @param {*} dataSearchKey
 * @param {*} dataSearchQueryEnabled
 * @param {*} getFetchMore
 */
function useDataSearchInfinite(
    dataSearchKey,
    dataSearchQueryEnabled,
    getFetchMore
) {
    return useInfiniteQuery(dataSearchKey, searchDataInfinite, {
        enabled: dataSearchQueryEnabled,
        getFetchMore: getFetchMore,
    });
}

function useAppsSearchInfinite(
    appsSearchKey,
    appsSearchQueryEnabled,
    getFetchMore
) {
    return useInfiniteQuery(appsSearchKey, searchAppsInfiniteQuery, {
        enabled: appsSearchQueryEnabled,
        getFetchMore: getFetchMore,
    });
}

export {
    useDataSearch,
    useAppsSearch,
    useAnalysesSearch,
    useAnalysesSearchInfinite,
    useDataSearchInfinite,
    useAppsSearchInfinite,
};
