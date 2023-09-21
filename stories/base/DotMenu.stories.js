import React from "react";
import { MenuItem } from "@mui/material";

import DotMenu from "components/dotMenu/DotMenu";

const getMenuItems = (onClose) => [
    <MenuItem
        key={1}
        onClick={() => {
            onClose();
            console.log("Clicked Item 1");
        }}
    >
        Item 1
    </MenuItem>,
    <MenuItem
        key={2}
        onClick={() => {
            onClose();
            console.log("Clicked Item 2");
        }}
    >
        Item 2
    </MenuItem>,
    <MenuItem
        key={3}
        onClick={() => {
            onClose();
            console.log("Clicked Item 3");
        }}
    >
        Item 3
    </MenuItem>,
];

export const DotMenuTest = () => {
    return <DotMenu baseId="sampleDotMenu" render={getMenuItems} />;
};

export const DotMenuWithText = () => {
    return (
        <DotMenu
            baseId="sampleDotMenu"
            render={getMenuItems}
            buttonText="More Actions"
        />
    );
};

export default { title: "base/DotMenu" };
