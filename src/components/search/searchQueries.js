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
import { searchTeams } from "../../serviceFacades/groups";

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
        queryFn: () => searchData(dataSearchKey[1]),
        enabled,
        onSuccess,
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
        queryFn: () => searchApps(appsSearchKey[1]),
        enabled,
        onSuccess,
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
function useAnalysesSearch(analysesSearchKey, enabled, onSuccess) {
    return useQuery({
        queryKey: analysesSearchKey,
        queryFn: () => getAnalyses(analysesSearchKey[1]),
        enabled,
        onSuccess,
    });
}

function useTeamsSearch(key, enabled, onSuccess) {
    return useQuery({
        queryKey: key,
        queryFn: () => searchTeams(key[1]),
        enabled,
        onSuccess,
    });
}

/**
 * Analyses infinite load search query
 * @param {object} analysesSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} getNextPageParam - Function to be used when more data needs to be loaded.
 *
 * @returns {function}
 */
function useAnalysesSearchInfinite(
    analysesSearchKey,
    enabled,
    getNextPageParam
) {
    return useInfiniteQuery(
        analysesSearchKey,
        ({ pageParam = 0 }) =>
            searchAnalysesInfinite({ ...analysesSearchKey[1], pageParam }),
        {
            enabled,
            getNextPageParam,
        }
    );
}

/**
 *
 * Data infinite load search query
 *
 * @param {object} dataSearchKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} getNextPageParam - Function to be used when more data needs to be loaded.
 */
function useDataSearchInfinite(dataSearchKey, enabled, getNextPageParam) {
    return useInfiniteQuery(
        dataSearchKey,
        ({ pageParam = 0 }) =>
            searchDataInfinite({ ...dataSearchKey[1], pageParam }),
        {
            enabled,
            getNextPageParam,
        }
    );
}

/**
 * Apps infinite load search query
 *
 * @param {*} appsSearchKey - The query key to be used.
 * @param {*} enabled - Enable / disable query.
 * @param {*} getNextPageParam - Function to be used when more data needs to be loaded.
 */
function useAppsSearchInfinite(appsSearchKey, enabled, getNextPageParam) {
    return useInfiniteQuery(
        appsSearchKey,
        ({ pageParam = 0 }) =>
            searchAppsInfiniteQuery({ ...appsSearchKey[1], pageParam }),
        {
            enabled,
            getNextPageParam,
        }
    );
}

export {
    useDataSearch,
    useAppsSearch,
    useAnalysesSearch,
    useTeamsSearch,
    useAnalysesSearchInfinite,
    useDataSearchInfinite,
    useAppsSearchInfinite,
};
