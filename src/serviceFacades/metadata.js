/**
 * @author psarando
 */
import callApi from "../common/callApi";
import axiosInstance from "../common/getAxios";

const FILESYSTEM_METADATA_QUERY_KEY = "fetchFilesystemMetadataKey";
const SEARCH_OLS_QUERY_KEY = "searchOntologyLookupServiceKey";
const SEARCH_UAT_QUERY_KEY = "searchUnifiedAstronomyThesaurusKey";

function getFilesystemMetadata(_, { dataId }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata`,
        method: "GET",
    });
}

function setFilesystemMetadata({ dataId, metadata }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata`,
        method: "POST",
        body: metadata,
    });
}

function saveFilesystemMetadata({ dataId, dest, recursive }) {
    return callApi({
        endpoint: `/api/filesystem/${dataId}/metadata/save`,
        method: "POST",
        body: { dest, recursive },
    });
}

/**
 * The Ontology Lookup Service `select` endpoint:
 * http://www.ebi.ac.uk/ols/docs/api#_select_terms
 *
 * 3rd Party Service URL/Endpoint Settings
 * org.iplantc.services.ontology-lookup-service.base = https://www.ebi.ac.uk/ols/api/select
 *
 * @param {any} key - react-query key
 * @param {string} param.searchTerm
 * @param {string[]} param.ontology - OLS searches may be restricted to a set of ontologies with a list of OLS ontology IDs e.g. "edam" or "uberon,ma".
 * @param {string} param.entityType - OLS searches may be restricted to one entity type.
 * @param {string[]} param.childrenOf - OLS searches may be restricted to all children of a given term (subclassOf/is-a relation only) with a list of IRI for the terms to search under.
 * @param {string[]} param.allChildrenOf - OLS searches may be restricted to all children of a given term (subclassOf/is-a plus any hierarchical/transitive properties like 'part of' or 'develops from') with a list of IRI for the terms to search under.
 */
function searchOntologyLookupService(
    key,
    { searchTerm, ontology, entityType, childrenOf, allChildrenOf }
) {
    const params = {
        fieldList: "id,iri,label,ontology_prefix",
        q: searchTerm,
        rows: 50,
        start: 0,
    };

    if (entityType) {
        params.type = entityType;
    }

    if (ontology && ontology.length > 0) {
        params.ontology = ontology;
    }

    if (childrenOf && childrenOf.length > 0) {
        params.childrenOf = childrenOf;
    }

    if (allChildrenOf && allChildrenOf.length > 0) {
        params.allChildrenOf = allChildrenOf;
    }

    return axiosInstance
        .request({
            url: "/api/ontology-lookup-service",
            method: "GET",
            params,
        })
        .then((apiResponse) => apiResponse.data);
}

/**
 * The Unified Astronomy Thesaurus `concept` endpoint:
 * https://documentation.ands.org.au/display/DOC/Linked+Data+API
 *
 * UAT responses do not include a `total` number of results.
 * The UAT service may return duplicates in the results.
 *
 * org.iplantc.services.unified-astronomy-thesaurus.base = https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/current/concept.json
 *
 * @param {any} key - react-query key
 * @param {string} param.searchTerm
 * @param {string[]} param.orderBy - A list of property paths to values that should be sorted on. A `-` prefix on a property path indicates a descending search.
 */
function searchUnifiedAstronomyThesaurus(_, { searchTerm, orderBy, limit }) {
    const params = {
        labelcontains: searchTerm,
        _pageSize: 50,
    };

    if (orderBy) {
        params._sort = orderBy;
    }

    return axiosInstance
        .request({
            url: "/api/unified-astronomy-thesaurus",
            method: "GET",
            params,
        })
        .then((apiResponse) => apiResponse.data);
}

export {
    FILESYSTEM_METADATA_QUERY_KEY,
    SEARCH_OLS_QUERY_KEY,
    SEARCH_UAT_QUERY_KEY,
    getFilesystemMetadata,
    saveFilesystemMetadata,
    setFilesystemMetadata,
    searchOntologyLookupService,
    searchUnifiedAstronomyThesaurus,
};
