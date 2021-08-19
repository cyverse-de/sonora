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
 * @param {Object} queryKey - The query key to be used.
 * @param {boolean} enabled - Enable / disable query.
 * @param {function} onSuccess - Function to callback when query succeeds.
 */
function useFileManifest(queryKey, enabled, onSuccess) {
    return useQuery({
        queryKey,
        queryFn: () => fileManifest(queryKey[1]),
        enabled,
        onSuccess,
    });
}

/**
 * Get a chunk from the file
 * @param {*} queryKey - The query key to be used.
 * @param {*} enabled  - Enable / disable query.
 * @param {*} getNextPageParam - Function to be used when more data needs to be loaded.
 */
function useReadChunk(queryKey, enabled, getNextPageParam) {
    return useInfiniteQuery(
        queryKey,
        ({ pageParam = 0 }) => readFileChunk({ ...queryKey[1], pageParam }),
        {
            enabled,
            getNextPageParam,
        }
    );
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
