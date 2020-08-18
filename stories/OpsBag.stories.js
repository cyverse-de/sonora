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
    //const [bagItems, add, remove] = useOpsBag("testbag");

    // Clean out the bag first, if necessary.
    // if (bagItems && bagItems.length > 0) {
    //     bagItems.forEach((_, index) => {
    //         remove(index);
    //     });
    // }

    //data.forEach((item) => add(item));

    return <OpsBag open={open} bagItems={data} remove={() => {}} />;
};
