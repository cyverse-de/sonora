import callApi from "../common/callApi";

const OAUTH_CALLBACK_QUERY_KEY = "oauthCallback";

function doOAuthCallback({ apiName, code, stateId }) {
    return callApi({
        endpoint: `/api/oauth/access-code/${apiName}?code=${code}&state=${stateId}`,
        method: "GET",
    });
}

export { OAUTH_CALLBACK_QUERY_KEY, doOAuthCallback };
