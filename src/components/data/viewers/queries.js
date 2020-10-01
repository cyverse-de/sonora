/**
 * @author sriram
 *
 * react-queries for file viewers.
 *
 */

import {
    queryCache,
    useQuery,
    useInfiniteQuery,
    useMutation,
} from "react-query";
import { fileManifest, readFileChunk } from "serviceFacades/filesystem";
import { uploadTextAsFile } from "serviceFacades/fileio";

/**
 * Get manifest for a file
 * @param {Object} queryKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} onSuccess - Function to callback when query succeeds.
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
    return useInfiniteQuery(queryKey, readFileChunk, {
        enabled,
        getFetchMore,
    });
}

/**
 *
 * Save text as a file
 *
 * @param {function} onSuccess
 * @param {function} onError
 */
function useSaveTextAsFile(onSuccess, onError) {
    return useMutation(uploadTextAsFile, { onSuccess, onError });
}

/**
 * Invalidate and refetch viewer manifest and chunk
 *
 * @param {*} key - The query key to be used.
 */
function refreshViewer(key) {
    queryCache.invalidateQueries(key, { exact: true, refetchInactive: true });
}

export { refreshViewer, useFileManifest, useReadChunk, useSaveTextAsFile };
