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

export const useBagRemoveItems = (
    { handleError, handleSuccess, handleSettled } = {
        handleError: (error) => {
            console.log(error.message);
        },
        handleSuccess: null,
        handleSettled: null,
    }
) => {
    const queryCache = useQueryCache();

    const successFn = (data, variables) => {
        if (handleSuccess) {
            return handleSuccess(data, variables);
        }

        queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, {
            items: [],
        });
    };

    const settledFn = () => {
        if (handleSettled) {
            return handleSettled();
        }

        queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
    };

    const [mutate] = useMutation(deleteDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
        onSettled: settledFn,
    });

    return async () => await mutate();
};

export const useBagRemoveItem = (
    { handleError, handleSuccess, handleSettled } = {
        handleError: (error) => {
            console.log(error.message);
        },
        handleSuccess: null,
        handleSettled: null,
    }
) => {
    const queryCache = useQueryCache();

    const successFn = (data, variables) => {
        if (handleSuccess) {
            return handleSuccess(data, variables);
        }

        queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, data);
    };

    const settledFn = () => {
        if (handleSettled) {
            return handleSettled();
        }

        queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
    };

    const [mutate] = useMutation(updateDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
        onSettled: settledFn,
    });

    return async (item) => {
        let data = queryCache.getQueryData(DEFAULT_BAG_QUERY_KEY);
        data.items = data.items.filter((i) => i.id !== item.id);
        return await mutate(data);
    };
};

export const useBagAddItem = (
    { handleError, handleSuccess, handleSettled } = {
        handleError: (error) => {
            console.log(error.message);
        },
        handleSuccess: null,
        handleSettled: null,
    }
) => {
    const queryCache = useQueryCache();

    const successFn = (data, variables) => {
        if (handleSuccess) {
            return handleSuccess(data, variables);
        }

        queryCache.setQueryData(DEFAULT_BAG_QUERY_KEY, data);
    };

    const settledFn = () => {
        if (handleSettled) {
            return handleSettled();
        }

        queryCache.invalidateQueries(DEFAULT_BAG_QUERY_KEY);
    };

    const [mutate] = useMutation(updateDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
        onSettled: settledFn,
    });

    return async (item) => {
        let data = queryCache.getQueryData(DEFAULT_BAG_QUERY_KEY);
        data.items = [...data.items, item];
        return await mutate(data);
    };
};
