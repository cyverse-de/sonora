import React, { useState } from "react";

import { withKnobs, button } from "@storybook/addon-knobs";

import { mockAxios } from "../axiosMock";

import OpsBag, {
    FILE_TYPE,
    FOLDER_TYPE,
    ANALYSIS_TYPE,
    APP_TYPE,
} from "../../src/components/Bag";

export default {
    title: "Bags/Bag",
    decorators: [withKnobs],
};

const data = {
    items: [
        {
            name: "test file 1",
            path: "/test/path/1",
            type: FILE_TYPE,
        },
        {
            name: "test folder 1",
            path: "/test/folder/1",
            type: FOLDER_TYPE,
        },
        {
            name: "test analysis 1",
            type: ANALYSIS_TYPE,
        },
        { name: "test app 1", type: APP_TYPE },
    ],
};

export const TestBag = () => {
    const [open, setOpen] = useState(true);

    button("Open", () => setOpen(true));

    mockAxios.onGet("/api/bags/default").reply(200, data);

    return (
        <OpsBag open={open} remove={() => {}} onClose={() => setOpen(false)} />
    );
};
