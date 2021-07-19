import React from "react";
import { MenuItem } from "@material-ui/core";

import DotMenu from "../src/components/dotMenu/DotMenu";

export const DotMenuTest = () => {
    return (
        <DotMenu
            baseId="sampleDotMenu"
            render={(onClose) => [
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
            ]}
        />
    );
};
// eslint-disable-next-line import/no-anonymous-default-export
export default { title: "lib/DotMenu" };
