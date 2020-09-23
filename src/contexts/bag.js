import { useMutation, useQuery, useQueryCache } from "react-query";
import * as facade from "../serviceFacades/bags";

export const useBag = () => {
    return useQuery(facade.DEFAULT_BAG_QUERY_KEY, facade.getDefaultBag);
};

export const useBagRemoveItems = () => {
    const queryCache = useQueryCache();
    return useMutation(facade.deleteDefaultBag, {
        onSuccess: () => {
            queryCache.setQueryData(facade.DEFAULT_BAG_QUERY_KEY, {
                items: [],
            });
        },
        onError: (error) => {
            console.log(`error from useBagRemoveItems: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(facade.DEFAULT_BAG_QUERY_KEY);
        },
    });
};

export const useBagRemoveItem = (item) => {
    const queryCache = useQueryCache();
    const [mutate] = useMutation(facade.updateDefaultBag, {
        onSuccess: (data, variables) => {
            queryCache.setQueryData(facade.DEFAULT_BAG_QUERY_KEY, data);
        },
        onError: (error) => {
            console.log(`error from useBagRemoveItem: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(facade.DEFAULT_BAG_QUERY_KEY);
        },
    });
    return async (item) => {
        let data = queryCache.getQueryData(facade.DEFAULT_BAG_QUERY_DATA);
        data.items = data.items.filter((i) => i.id !== item.id);
        return await mutate(data);
    };
};

export const useBagAddItem = (item) => {
    const queryCache = useQueryCache();
    const [mutate] = useMutation(facade.updateDefaultBag, {
        onSuccess: (data, variables) => {
            queryCache.setQueryData(facade.DEFAULT_BAG_QUERY_KEY, data);
        },
        onError: (error) => {
            console.log(`error from useBagAddItem: ${error}`);
        },
        onSettled: () => {
            queryCache.invalidateQueries(facade.DEFAULT_BAG_QUERY_DATA);
        },
    });

    return async (item) => {
        let data = queryCache.getQueryData(facade.DEFAULT_BAG_QUERY_DATA);
        data.items = [...data.items, item];
        return await mutate(data);
    };
};
