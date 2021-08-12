import callApi from "common/callApi";

const VICE_LOADING_STATUS_QUERY = "fetchViceLoadingStatus";
const VICE_LOADING_URL_READY = "fetchViceUrlReady";

// sample URL: https://a12345678.cyverse.run:4343
export function extractSubdomain(urlWithSubdomain) {
    const url = decodeURIComponent(urlWithSubdomain);
    return url?.split("/")?.pop()?.split(".")?.shift();
}

function getLoadingStatus({ accessUrl }) {
    const subdomain = extractSubdomain(accessUrl);
    return callApi({
        endpoint: `/api/vice/${subdomain}/description`,
    });
}

function getUrlReady({ accessUrl }) {
    const subdomain = extractSubdomain(accessUrl);
    return callApi({
        endpoint: `/api/vice/${subdomain}/url-ready`,
    });
}

export {
    VICE_LOADING_STATUS_QUERY,
    VICE_LOADING_URL_READY,
    getLoadingStatus,
    getUrlReady,
};
