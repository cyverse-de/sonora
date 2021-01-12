import callApi from "common/callApi";

export default function requestAccess(request) {
    return callApi({
        endpoint: "/api/requests/vice",
        method: "POST",
        body: request,
    });
}
