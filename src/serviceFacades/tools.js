import callApi from "../common/callApi";

function getTools(key) {
    return callApi({
        endpoint: `/api/tools`,
        method: "GET",
    });
}

export { getTools };
