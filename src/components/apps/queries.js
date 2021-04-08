/**
 * react-query functions for Apps.
 *
 * @author psarando
 */
import { useQuery } from "react-query";

import {
    getReferenceGenomes,
    REFERENCE_GENOMES_QUERY_KEY,
} from "serviceFacades/referenceGenomes";

import { stableSort } from "@cyverse-de/ui-lib";

export function useReferenceGenomes(enabled, onSuccess, onError) {
    return useQuery({
        queryKey: [REFERENCE_GENOMES_QUERY_KEY, { deleted: false }],
        queryFn: getReferenceGenomes,
        config: {
            enabled,
            onSuccess: (resp) => {
                const genomes = resp?.genomes || [];
                onSuccess(
                    stableSort(genomes, (a, b) => a.name.localeCompare(b.name))
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
