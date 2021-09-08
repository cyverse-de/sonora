import { useMutation } from "react-query";
import { useBagInfo } from "contexts/bagInfo";
import callAPI from "../common/callApi";

export const DEFAULT_BAG_QUERY_KEY = "getDefaultBag";
export const DEFAULT_BAG_MUTATION_KEY = "mutateDefaultBag";
export const DEFAULT_BAG_DELETE_KEY = "deleteDefaultBag";

export const getDefaultBag = () =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "GET",
    });

export const updateDefaultBag = (contents) => {
    return callAPI({
        endpoint: "/api/bags/default",
        method: "POST",
        body: contents,
    });
};

export const deleteDefaultBag = (key) =>
    callAPI({
        endpoint: "/api/bags/default",
        method: "DELETE",
    });

export const useBagRemoveItems = (
    { handleError, handleSuccess } = {
        handleError: (error) => {
            console.log(`error from useBagRemoveItems: ${error.message}`);
        },
        handleSuccess: null,
    }
) => {
    const setBagInfo = useBagInfo()[1];
    const successFn = (data, variables) => {
        setBagInfo(data);
        if (handleSuccess) {
            handleSuccess(data, variables);
        }
    };

    const { mutate } = useMutation(deleteDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
    });

    return async () => await mutate();
};

export const useBagRemoveItem = (
    { handleError, handleSuccess } = {
        handleError: (error) => {
            console.log(`error from useBagRemoveItem: ${error.message}`);
        },
        handleSuccess: null,
    }
) => {
    const [bagInfo, setBagInfo] = useBagInfo();
    const successFn = (data, variables) => {
        setBagInfo(data);
        if (handleSuccess) {
            handleSuccess(data, variables);
        }
    };

    const { mutate } = useMutation(updateDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
    });

    return async (item) => {
        let data = bagInfo;

        if (!data?.contents?.items) {
            data.contents.items = [];
        }

        data.contents.items = data.contents.items.filter(
            (i) => i.id !== item.id
        );

        return await mutate(data.contents);
    };
};

export const useBagAddItem = (
    { handleError, handleSuccess } = {
        handleError: (error) => {
            console.log(`error from useBagAddItem: ${error.message}`);
        },
        handleSuccess: null,
    }
) => {
    const [bagInfo, setBagInfo] = useBagInfo();
    const successFn = (data, variables) => {
        setBagInfo(data);

        if (handleSuccess) {
            handleSuccess(data, variables);
        }
    };

    const { mutate } = useMutation(updateDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
    });

    return async (item) => {
        let data = bagInfo;

        if (!data.contents.items) {
            data.contents.items = [];
        }

        if (!data.contents.items.some((el) => el.id === item.id)) {
            data.contents.items = [...data.contents.items, item];
        }

        return await mutate(data.contents);
    };
};

export const useBagAddItems = (
    { handleError, handleSuccess, handleSettled } = {
        handleError: (error) => {
            console.log(`error from useBagAddItems: ${error.message}`);
        },
        handleSuccess: null,
    }
) => {
    const [bagInfo, setBagInfo] = useBagInfo();
    const successFn = (data, variables) => {
        setBagInfo(data);

        if (handleSuccess) {
            handleSuccess(data, variables);
        }
    };

    const settledFn = () => {
        if (handleSettled) {
            handleSettled();
        }
    };

    const { mutate } = useMutation(updateDefaultBag, {
        onSuccess: successFn,
        onError: handleError,
        onSettled: settledFn,
    });

    return async (items) => {
        let data = bagInfo || {
            contents: { items: [] },
        };

        if (!data.contents.items) {
            data.contents.items = [];
        }

        const filteredItems = items.filter(
            (item) => !data.contents.items.some((el) => el.id === item.id)
        );
        data.contents.items = [...data.contents.items, ...filteredItems];

        return await mutate(data.contents);
    };
};
