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
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} onSuccess - Callback function to be used when the query succeeds.
 *
 * @returns {function}
 */
function useDataSearch(dataSearchKey, enabled, onSuccess) {
    return useQuery({
        queryKey: dataSearchKey,
        queryFn: searchData,
        config: {
            enabled,
            onSuccess,
        },
    });
}

/**
 * Apps search query
 *
 * @param {object} appsSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} onSuccess - Callback function to be used when the query succeeds.
 *
 * @returns {function}
 */
function useAppsSearch(appsSearchKey, enabled, onSuccess) {
    return useQuery({
        queryKey: appsSearchKey,
        queryFn: searchApps,
        config: {
            enabled,
            onSuccess,
        },
    });
}

/**
 * Analyses search query
 *
 * @param {object} analysesSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} onSuccess - Callback function to be used when the query succeeds.
 *
 * @returns {function}
 */
function useAnalysesSearch(
    analysesSearchKey,
    enabled,
    onSuccess
) {
    return useQuery({
        queryKey: analysesSearchKey,
        queryFn: getAnalyses,
        config: {
            enabled,
            onSuccess,
        },
    });
}

/**
 * Analyses infinite load search query
 * @param {object} analysesSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} getFetchMore - Function to be used when more data needs to be loaded.
 *
 * @returns {function}
 */
function useAnalysesSearchInfinite(
    analysesSearchKey,
    enabled,
    getFetchMore
) {
    return useInfiniteQuery(analysesSearchKey, searchAnalysesInfinite, {
        enabled,
        getFetchMore
    });
}

/**
 *
 * Data infinite load search query
 *
 * @param {object} dataSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} getFetchMore - Function to be used when more data needs to be loaded.
 */
function useDataSearchInfinite(
    dataSearchKey,
    enabled,
    getFetchMore
) {
    return useInfiniteQuery(dataSearchKey, searchDataInfinite, {
        enabled,
        getFetchMore
    });
}

/**
 * Apps infinite load search query
 *
 * @param {*} appsSearchKey - The query key to be used.
 * @param {*} enabled - Enable / disable query.
 * @param {*} getFetchMore - Function to be used when more data needs to be loaded.
 */
function useAppsSearchInfinite(
    appsSearchKey,
    enabled,
    getFetchMore
) {
    return useInfiniteQuery(appsSearchKey, searchAppsInfiniteQuery, {
        enabled,
        getFetchMore
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
