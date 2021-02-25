import callApi from "../../common/callApi";

const VICE_LOADING_STATUS_QUERY = "fetchViceLoadingStatus";
const VICE_LOADING_URL_READY = "fetchViceUrlReady";

export function extractSubdomain(urlWithSubdomain) {
    const u = decodeURIComponent(urlWithSubdomain);
    const fields = u.split("/").pop().split(".");

    // debug(`hostname split; url: ${urlWithSubdomain}; fields: ${fields}`);

    if (fields.length < 2) {
        throw new Error(`no subdomain found in ${urlWithSubdomain}`);
    }
    if (fields.length === 2 && fields[0] === "www") {
        // debug(`extractSubdomain; URL: ${urlWithSubdomain}; return ''`);
        return "";
    }

    // debug(`extractSubdomain; URL: ${urlWithSubdomain}; return ${fields[0]}`);
    return fields[0];
}

function getLoadingStatus(key, { accessUrl }) {
    const subdomain = extractSubdomain(accessUrl);
    return callApi({
        endpoint: `/api/vice/${subdomain}/description`,
    });
}

function getUrlReady(key, { accessUrl }) {
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
