/**
 *
 * @author sriram
 *
 *
 */

import { useQuery } from "react-query";
import { searchData } from "serviceFacades/filesystem";
import { searchApps } from "serviceFacades/apps";
import { getAnalyses } from "serviceFacades/analyses";

/**
 *
 * Data search query
 *
 * @param {object} dataSearchKey
 * @param {boolean} dataSearchQueryEnabled
 * @param {function} successCallback
 *
 * @returns
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
 * @returns
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
 * @returns
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

export { useDataSearch, useAppsSearch, useAnalysesSearch };
