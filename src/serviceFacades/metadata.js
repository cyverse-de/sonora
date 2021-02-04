/**
 * @author psarando
 */
import callApi from "../common/callApi";
import axiosInstance from "../common/getAxios";

const EXTERNAL_API_DEFAULT_RESULT_LIMIT = 50;
const FILESYSTEM_METADATA_QUERY_KEY = "fetchFilesystemMetadataKey";
const FILESYSTEM_METADATA_TEMPLATE_QUERY_KEY =
    "fetchFilesystemMetadataTemplateKey";
const FILESYSTEM_METADATA_TEMPLATE_LISTING_QUERY_KEY =
    "fetchFilesystemMetadataTemplateListingKey";
const SEARCH_OLS_QUERY_KEY = "searchOntologyLookupServiceKey";
const SEARCH_UAT_QUERY_KEY = "searchUnifiedAstronomyThesaurusKey";

function getFilesystemMetadataTemplateListing() {
    return callApi({
        endpoint: "/api/filesystem/metadata/templates",
        method: "GET",
    });
}

function getFilesystemMetadataTemplate(_, templateId) {
    return callApi({
        endpoint: `/api/filesystem/metadata/template/${templateId}`,
        method: "GET",
    });
}

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
 * @param {any} key - react-query key
 * @param {string} param.searchTerm
 * @param {string[]} param.ontology - OLS searches may be restricted to a set of ontologies with a list of OLS ontology IDs e.g. "edam" or "uberon,ma".
 * @param {string} param.type - OLS searches may be restricted to one entity type.
 * @param {string[]} param.childrenOf - OLS searches may be restricted to all children of a given term (subclassOf/is-a relation only) with a list of IRI for the terms to search under.
 * @param {string[]} param.allChildrenOf - OLS searches may be restricted to all children of a given term (subclassOf/is-a plus any hierarchical/transitive properties like 'part of' or 'develops from') with a list of IRI for the terms to search under.
 */
function searchOntologyLookupService(
    key,
    { searchTerm, ontology, type, childrenOf, allChildrenOf }
) {
    const params = {
        fieldList: "id,iri,label,ontology_prefix",
        q: searchTerm,
        rows: EXTERNAL_API_DEFAULT_RESULT_LIMIT,
        start: 0,
    };

    if (type) {
        // The old DE may have stored this type in the db in all uppercase,
        // but the API wants all lowercase.
        params.type = type.toLowerCase();
    }

    if (ontology?.length > 0) {
        params.ontology = ontology.join(",");
    }

    if (childrenOf?.length > 0) {
        params.childrenOf = childrenOf.join(",");
    }

    if (allChildrenOf?.length > 0) {
        params.allChildrenOf = allChildrenOf.join(",");
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
 * @param {any} key - react-query key
 * @param {string} param.searchTerm
 * @param {string[]} param.orderBy - A list of property paths to values that should be sorted on. A `-` prefix on a property path indicates a descending search.
 */
function searchUnifiedAstronomyThesaurus(key, { searchTerm, orderBy }) {
    const params = {
        labelcontains: searchTerm,
        _pageSize: EXTERNAL_API_DEFAULT_RESULT_LIMIT,
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
    FILESYSTEM_METADATA_TEMPLATE_QUERY_KEY,
    FILESYSTEM_METADATA_TEMPLATE_LISTING_QUERY_KEY,
    SEARCH_OLS_QUERY_KEY,
    SEARCH_UAT_QUERY_KEY,
    getFilesystemMetadata,
    getFilesystemMetadataTemplate,
    getFilesystemMetadataTemplateListing,
    saveFilesystemMetadata,
    setFilesystemMetadata,
    searchOntologyLookupService,
    searchUnifiedAstronomyThesaurus,
};
