import callAPI from "../common/callApi";

export const DEFAULT_BAG_QUERY_KEY = "getDefaultBag";
export const DEFAULT_BAG_MUTATION_KEY = "mutateDefaultBag";
export const DEFAULT_BAG_DELETE_KEY = "deleteDefaultBag";

export const getDefaultBag = (key) =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "GET",
    });

export const updateDefaultBag = (key, contents) =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "POST",
        body: contents,
    });

export const deleteDefaultBag = (key) =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "DELETE",
    });
