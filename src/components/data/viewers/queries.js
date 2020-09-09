/**
 * @author sriram
 *
 * react-queries for file viewers.
 *
 */

import { useQuery, useInfiniteQuery } from "react-query";
import { fileManifest, readFileChuck } from "serviceFacades/filesystem";

/**
 * Get manifest for a file
 * @param {*} queryKey - The query key to be used.
 * @param {*} enabled - Enable / disable query.
 * @param {*} onSuccess - Callback function to be used when the query succeeds.
 */
function useFileManifest(queryKey, enabled, onSuccess) {
    return useQuery({
        queryKey,
        queryFn: fileManifest,
        config: {
            enabled,
            onSuccess,
        },
    });
}

/**
 * Get a chunk from the file
 * @param {*} queryKey - The query key to be used.
 * @param {*} enabled  - Enable / disable query.
 * @param {*} getFetchMore - Function to be used when more data needs to be loaded.
 */
function useReadChunk(queryKey, enabled, getFetchMore) {
    return useInfiniteQuery(queryKey, readFileChuck, {
        enabled,
        getFetchMore,
    });
}

export { useFileManifest, useReadChunk };
