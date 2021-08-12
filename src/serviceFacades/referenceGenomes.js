import callApi from "../common/callApi";

export const REFERENCE_GENOMES_QUERY_KEY = [
    "referenceGenomesKey",
    { deleted: false },
];
export const ADMIN_REFERENCE_GENOMES_QUERY_KEY = "adminReferenceGenomesKey";

/**
 * Get the current listing of Reference Genomes.
 *
 * @returns {Promise<any>}
 */
export const getReferenceGenomes = ({ deleted }) => {
    return callApi({
        endpoint: `/api/reference-genomes?deleted=${deleted}`,
    });
};

export const createReferenceGenome = (refGenome) => {
    return callApi({
        endpoint: "/api/admin/reference-genomes",
        method: "POST",
        body: refGenome,
    });
};

export const saveReferenceGenome = (refGenome) => {
    const id = refGenome?.id;
    return callApi({
        endpoint: `/api/admin/reference-genomes/${id}`,
        method: "PATCH",
        body: refGenome,
    });
};
