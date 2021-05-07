/**
 * react-query functions for Apps.
 *
 * @author psarando
 */
import { useQuery } from "react-query";

import {
    getAppElementInfoTypes,
    APP_ELEMENT_INFO_TYPES_QUERY_KEY,
} from "serviceFacades/apps";

import {
    getReferenceGenomes,
    REFERENCE_GENOMES_QUERY_KEY,
} from "serviceFacades/referenceGenomes";

import { stableSort } from "@cyverse-de/ui-lib";

export function useAppElementInfoTypes(enabled, onSuccess, onError) {
    return useQuery({
        queryKey: APP_ELEMENT_INFO_TYPES_QUERY_KEY,
        queryFn: getAppElementInfoTypes,
        config: {
            enabled,
            onSuccess: (resp) => {
                const info_types = resp?.info_types || [];
                onSuccess(
                    stableSort(info_types, (a, b) =>
                        a.label.localeCompare(b.label)
                    )
                );
            },
            onError: (e) => {
                if (onError) {
                    onError(e);
                } else {
                    // App params will show an inline error message.
                    console.error(e);
                }
            },
        },
    });
}

export function sortReferenceGenomes(genomes) {
    return stableSort(genomes, (a, b) => a.name.localeCompare(b.name));
}

export function useReferenceGenomes(enabled, onSuccess, onError) {
    return useQuery({
        queryKey: REFERENCE_GENOMES_QUERY_KEY,
        queryFn: getReferenceGenomes,
        config: {
            enabled,
            staleTime: Infinity,
            cacheTime: Infinity,
            onSuccess: (resp) => {
                const genomes = resp?.genomes || [];
                onSuccess && onSuccess(sortReferenceGenomes(genomes));
            },
            onError: (e) => {
                if (onError) {
                    onError(e);
                } else {
                    // App params will show an inline error message.
                    console.error(e);
                }
            },
        },
    });
}
