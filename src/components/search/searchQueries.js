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
 * @param {object} dataSearchKey - The query key to be used.
 * @param {boolean} dataSearchQueryEnabled - Enable / diable query.
 * @param {function} successCallback - Callback function to be used when the query succeeds.
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
 * @param {object} appsSearchKey - The query key to be used.
 * @param {boolean} appsSearchQueryEnabled - Enable / diable query.
 * @param {function} successCallback - Callback function to be used when the query succeeds.
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
 * @param {object} analysesSearchKey - The query key to be used.
 * @param {booelan} analysesSearchQueryEnabled - Enable / diable query.
 * @param {function} successCallback - Callback function to be used when the query succeeds.
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
 * @param {object} analysesSearchKey - The query key to be used.
 * @param {boolean} analysesSearchQueryEnabled - Enable / diable query.
 * @param {function} getFetchMore - Function to be used when more data needs to be loaded.
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
 * @param {*} dataSearchKey - The query key to be used.
 * @param {*} dataSearchQueryEnabled - Enable / diable query.
 * @param {*} getFetchMore - Function to be used when more data needs to be loaded.
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

/**
 * Apps infinite load search query
 *
 * @param {*} appsSearchKey - The query key to be used.
 * @param {*} appsSearchQueryEnabled - Enable / diable query.
 * @param {*} getFetchMore - Function to be used when more data needs to be loaded.
 */
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
