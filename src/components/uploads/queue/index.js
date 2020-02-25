/**
 * @author johnworth
 *
 * A component that pulls items out of the upload tracker and triggers them.
 *
 * @module UploadManager
 */
import React, { useState } from "react";

import { Drawer } from "@material-ui/core";

import {
    removeAction,
    useUploadTrackingDispatch,
    useUploadTrackingState,
} from "../../../contexts/uploadTracking";

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
    const dispatch = useUploadTrackingDispatch();
    const tracker = useUploadTrackingState();

    const { open, onClose } = props;
    const [isMaximized, setIsMaximized] = useState(true);

    const handleCancel = (event, upload) => {
        event.stopPropagation();
        event.preventDefault();

        upload.cancelFn();

        dispatch(
            removeAction({
                id: upload.id,
            })
        );
    };

    return (
        <>
            <Closable open={open} onClose={onClose}>
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

                    <UploadsTable
                        tracker={tracker}
                        handleCancel={handleCancel}
                    />
                </Drawer>
            </Closable>
        </>
    );
}
