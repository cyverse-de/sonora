import React from "react";

import { withKnobs, boolean } from "@storybook/addon-knobs";

import OpsBag from "../src/components/OpsBag";
import { Folder } from "@material-ui/icons";

export default {
    title: "OpsBag",
    decorators: [withKnobs],
};

const data = [
    {
        icon: <Folder />,
        label: "Test Folder 0",
    },
];

export const TestOpsBag = () => {
    const open = boolean("Open", true);

    return <OpsBag open={open} bagItems={data} remove={() => {}} />;
};
