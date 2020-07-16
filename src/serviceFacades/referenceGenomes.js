import callApi from "../common/callApi";

export const REFERENCE_GENOMES_QUERY_KEY = "referenceGenomesKey";

/**
 * Get the current listing of Reference Genomes.
 *
 * @returns {Promise<any>}
 */
export const getReferenceGenomes = () => {
    return callApi({
        endpoint: "/api/reference-genomes",
    });
};
