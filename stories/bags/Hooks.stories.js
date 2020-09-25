import React from "react";

import { withKnobs, button } from "@storybook/addon-knobs";

import { mockAxios } from "../axiosMock";

import Bag, {
    FILE_TYPE,
    FOLDER_TYPE,
    ANALYSIS_TYPE,
    APP_TYPE,
} from "../../src/components/Bag";

import * as facade from "../../src/serviceFacades/bags";

export default {
    title: "Bags/Hooks",
    decorators: [withKnobs],
};

let counter = 0;

const getCount = () => {
    counter = counter + 1;
    return counter;
};

const data = {
    items: [
        {
            id: getCount(),
            name: "test file 1",
            path: "/test/path/1",
            type: FILE_TYPE,
        },
        {
            id: getCount(),
            name: "test folder 1",
            path: "/test/folder/1",
            type: FOLDER_TYPE,
        },
        {
            id: getCount(),
            name: "test analysis 1",
            type: ANALYSIS_TYPE,
        },
        { id: getCount(), name: "test app 1", type: APP_TYPE },
        { id: getCount(), name: "test app 2", type: APP_TYPE },
        { id: getCount(), name: "test app 3", type: APP_TYPE },
        { id: getCount(), name: "test app 4", type: APP_TYPE },
        { id: getCount(), name: "test app 5", type: APP_TYPE },
        { id: getCount(), name: "test app 6", type: APP_TYPE },
        { id: getCount(), name: "test app 7", type: APP_TYPE },
        { id: getCount(), name: "test app 8", type: APP_TYPE },
        { id: getCount(), name: "test app 9", type: APP_TYPE },
        { id: getCount(), name: "test app 10", type: APP_TYPE },
        { id: getCount(), name: "test app 11", type: APP_TYPE },
    ],
};

export const TestAddAndDeleteFromBag = () => {
    const addItem = facade.useBagAddItem();
    const deleteAllItems = facade.useBagRemoveItems();

    const deleteAllHandler = () => {
        data.items = [];
        return [200, data];
    };

    const addItemHandler = (config) => {
        const newID = getCount();
        data.items = [
            ...data.items,
            { id: newID, name: `added item ${newID}`, type: ANALYSIS_TYPE },
        ];
        return [200, data];
    };

    button("Add Item", () =>
        addItem({
            name: "test file 1",
            path: "/test/path/1",
            type: FILE_TYPE,
        })
    );

    button("Delete All Items", () => deleteAllItems());

    mockAxios.onGet("/api/bags/default").reply(200, data);
    mockAxios.onPost("/api/bags/default").reply(addItemHandler);
    mockAxios.onDelete("/api/bags/default").reply(deleteAllHandler);

    return <Bag />;
};
