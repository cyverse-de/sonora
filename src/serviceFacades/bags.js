import callAPI from "../common/callApi";

export const getDefaultBag = () =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "GET",
    });

export const updateDefaultBag = (contents) =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "POST",
        body: contents,
    });

export const deleteDefaultBag = () =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "DELETE",
    });
