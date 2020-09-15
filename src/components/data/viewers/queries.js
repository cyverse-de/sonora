/**
 * @author sriram
 *
 * react-queries for file viewers.
 *
 */

import { useQuery, useInfiniteQuery, useMutation } from "react-query";
import { fileManifest, readFileChunk } from "serviceFacades/filesystem";
import { uploadTextAsFile } from "serviceFacades/fileio";

/**
 * Get manifest for a file
 * @param {*} queryKey - The query key to be used.
 * @param {*} enabled - Enable / disable query.
 */
function useFileManifest(queryKey, enabled) {
    return useQuery({
        queryKey,
        queryFn: fileManifest,
        config: {
            enabled,
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

export { useFileManifest, useReadChunk, useSaveTextAsFile };
