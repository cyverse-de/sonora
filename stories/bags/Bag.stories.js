import React from "react";

import { withKnobs } from "@storybook/addon-knobs";
import { mockAxios } from "../axiosMock";
import Bag from "../../src/components/Bag";
import ResourceTypes from "../../src/components/models/ResourceTypes";

export default {
    title: "Bags/Bag",
    decorators: [withKnobs],
};

const APP_TYPE = "app";
const ANALYSIS_TYPE = "analysis";

const data = {
    contents: {
        items: [
            {
                name: "test file 1",
                path: "/test/path/file1",
                type: ResourceTypes.FILE_TYPE,
            },
            {
                name: "test folder 1",
                path: "/test/folder/folder1",
                type: ResourceTypes.FOLDER_TYPE,
            },
            {
                name: "test analysis 1",
                type: ANALYSIS_TYPE,
            },
            { name: "test app 1", type: APP_TYPE },
            { name: "test app 2", type: APP_TYPE },
            { name: "test app 3", type: APP_TYPE },
            { name: "test app 4", type: APP_TYPE },
            { name: "test app 5", type: APP_TYPE },
            { name: "test app 6", type: APP_TYPE },
            { name: "test app 7", type: APP_TYPE },
            { name: "test app 8", type: APP_TYPE },
            { name: "test app 9", type: APP_TYPE },
            { name: "test app 10", type: APP_TYPE },
            { name: "test app 11", type: APP_TYPE },
        ],
    },
};

export const TestBag = () => {
    mockAxios.onGet("/api/bags/default").reply(200, data);

    return <Bag />;
};
