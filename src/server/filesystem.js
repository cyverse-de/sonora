import request from "request";
import { terrainURL } from "./configuration";
import path from "path";
import querystring from "querystring";

/**
 * Proxies file listing requests to terrain.
 *
 * For request query parameters and return values, see
 * https://cyverse-de.github.io/api/endpoints/filesystem/directory-listing.html#paged-directory-listing
 */
export const configurablePagedListingHandler = (req, res, apiBaseURL) => {
    const apiURL = new URL(apiBaseURL);

    apiURL.pathname = path.join(
        apiURL.pathname,
        "/secured/filesystem/paged-directory"
    );

    apiURL.search = querystring.stringify(req.query);

    req.pipe(request.get(apiURL.href)).pipe(res);
};

export const pagedListingHandler = (req, res) =>
    configurablePagedListingHandler(req, res, terrainURL);
