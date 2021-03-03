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
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

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
    trackIntercomEvent(IntercomEvents.SEARCHING_DATA, {
        search: dataSearchKey[1]?.query,
    });
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
    trackIntercomEvent(IntercomEvents.SEARCHING_APPS, {
        search: appsSearchKey[1]?.search,
    });
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
function useAnalysesSearch(analysesSearchKey, enabled, onSuccess) {
    trackIntercomEvent(IntercomEvents.SEARCHING_ANALYSES, {
        search: analysesSearchKey[1]?.filter,
    });
    return useQuery({
        queryKey: analysesSearchKey,
        queryFn: getAnalyses,
        config: {
            enabled,
            onSuccess,
        },
    });
}

function useTeamsSearch(key, enabled, onSuccess) {
    trackIntercomEvent(IntercomEvents.SEARCHING_TEAMS, {
        search: key[1]?.searchTerm,
    });
    return useQuery({
        queryKey: key,
        queryFn: searchTeams,
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
function useAnalysesSearchInfinite(analysesSearchKey, enabled, getFetchMore) {
    trackIntercomEvent(IntercomEvents.SEARCHING_ANALYSES, {
        search: analysesSearchKey[1]?.filter,
    });
    return useInfiniteQuery(analysesSearchKey, searchAnalysesInfinite, {
        enabled,
        getFetchMore,
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
function useDataSearchInfinite(dataSearchKey, enabled, getFetchMore) {
    trackIntercomEvent(IntercomEvents.SEARCHED_DATA, {
        search: dataSearchKey[1]?.query,
    });
    return useInfiniteQuery(dataSearchKey, searchDataInfinite, {
        enabled,
        getFetchMore,
    });
}

/**
 * Apps infinite load search query
 *
 * @param {*} appsSearchKey - The query key to be used.
 * @param {*} enabled - Enable / disable query.
 * @param {*} getFetchMore - Function to be used when more data needs to be loaded.
 */
function useAppsSearchInfinite(appsSearchKey, enabled, getFetchMore) {
    trackIntercomEvent(IntercomEvents.SEARCHING_APPS, {
        search: appsSearchKey[1]?.search,
    });
    return useInfiniteQuery(appsSearchKey, searchAppsInfiniteQuery, {
        enabled,
        getFetchMore,
    });
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
