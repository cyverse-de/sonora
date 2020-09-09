import React from "react";

import { withKnobs, boolean } from "@storybook/addon-knobs";

import { mockAxios } from "../axiosMock";

import OpsBag from "../../src/components/OpsBag";

export default {
    title: "Bags/OpsBag",
    decorators: [withKnobs],
};

const data = {
    items: [
        {
            name: "test file 1",
            path: "/test/path/1",
            type: "file",
        },
        {
            name: "test folder 1",
            path: "/test/folder/1",
            type: "dir",
        },
    ],
};

export const TestOpsBag = () => {
    const open = boolean("Open", true);
    mockAxios.onGet("/api/bags/default").reply(200, data);

    return <OpsBag open={open} remove={() => {}} />;
};
