/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadQueue
 */
import React, { useState } from "react";

import { Drawer } from "@material-ui/core";

import UploadsToolbar from "./toolbar";
import UploadsTable from "./table";
import useStyles from "./styles";

const Closable = ({ open, onClose, children }) => {
    const [hasOpened, setHasOpened] = useState(false);

    if (!open) {
        if (hasOpened) {
            onClose();
        }

        return null;
    }

    if (!hasOpened) {
        setHasOpened(true);
    }
    return <div>{children}</div>;
};

export default function UploadQueue(props) {
    const classes = useStyles();

    const { open, onClose } = props;
    const [isMaximized, setIsMaximized] = useState(true);

    return (
        <>
            <Closable
                open={open}
                onClose={onClose}
                className={classes.closable}
            >
                <Drawer
                    anchor="bottom"
                    variant="persistent"
                    open={true}
                    classes={{
                        paper: isMaximized
                            ? classes.drawerMax
                            : classes.drawerMin,
                    }}
                >
                    <UploadsToolbar
                        isMaximized={isMaximized}
                        setIsMaximized={setIsMaximized}
                        onClose={onClose}
                    />

                    <UploadsTable />
                </Drawer>
            </Closable>
        </>
    );
}
