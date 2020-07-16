import callApi from "../common/callApi";

/**
 * Get the current listing of Reference Genomes.
 *
 * @returns {Promise<any>}
 */
export const REFERENCE_GENOMES_QUERY_KEY = "referenceGenomesKey";
export const getReferenceGenomes = () => {
    return callApi({
        endpoint: "/api/reference-genomes",
    });
};
