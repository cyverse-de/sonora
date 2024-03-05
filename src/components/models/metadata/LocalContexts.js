// Remove any trailing slash from the rightsURI
// and take the final part of the path as the project ID.
export const parseProjectID = (projectHubURI) =>
    projectHubURI?.replace(/\/$/, "").split("/").at(-1);

export const LocalContextsAttrs = {
    LOCAL_CONTEXTS: "LocalContexts",
    RIGHTS_URI: "rightsURI",
    RIGHTS_ID: "rightsIdentifier",
    RIGHTS_ID_SCHEME: "rightsIdentifierScheme",
    RIGHTS_ID_SCHEME_VALUE: "Local Contexts",
    SCHEME_URI: "schemeURI",
    SCHEME_URI_VALUE: "https://localcontexts.org",
};
