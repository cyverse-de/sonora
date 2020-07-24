import callApi from "../common/callApi";

function getReferenceGenomes() {
    return callApi({
        endpoint: "/api/admin/reference-genomes?deleted=true",
        method: "GET",
    });
}

export { getReferenceGenomes };
