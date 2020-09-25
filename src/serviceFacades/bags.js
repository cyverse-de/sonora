import { useMutation, useQuery, useQueryCache } from "react-query";

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

export const useBag = () => {
    return useQuery(DEFAULT_BAG_QUERY_KEY, getDefaultBag);
};

export const useBagRemoveItems = () => {
    const queryCache = useQueryCache();
    const [mutate] = useMutation(deleteDefaultBag, {
        onSuccess: () => {
            queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, {
                items: [],
            });
        },
        onError: (error) => {
            console.log(`error from useBagRemoveItems: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
        },
    });

    return async () => await mutate();
};

export const useBagRemoveItem = (item) => {
    const queryCache = useQueryCache();
    const [mutate] = useMutation(updateDefaultBag, {
        onSuccess: (data, variables) => {
            queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, data);
        },
        onError: (error) => {
            console.log(`error from useBagRemoveItem: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
        },
    });
    return async (item) => {
        let data = queryCache.getQueryData(DEFAULT_BAG_QUERY_KEY);
        data.items = data.items.filter((i) => i.id !== item.id);
        return await mutate(data);
    };
};

export const useBagAddItem = (item) => {
    const queryCache = useQueryCache();
    const [mutate] = useMutation(updateDefaultBag, {
        onSuccess: (data, variables) => {
            queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, data);
        },
        onError: (error) => {
            console.log(`error from useBagAddItem: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
        },
    });

    return async (item) => {
        let data = queryCache.getQueryData(DEFAULT_BAG_QUERY_KEY);
        data.items = [...data.items, item];
        return await mutate(data);
    };
};
