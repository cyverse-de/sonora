import React from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";

import UploadsQueue from "../uploads/queue";

import { useUploadTrackingState } from "../../contexts/uploadTracking";
import {
    drawerMaxHeight as uploadDrawerMaxHeight,
    drawerMinHeight as uploadDrawerMinHeight,
} from "../../components/uploads/queue/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    drawerContainer: {
        flexShrink: 0,
    },
    content: {
        flexGrow: 1,
    },
    contentUploadMinimized: {
        marginBottom: uploadDrawerMinHeight,
    },
    contentUploadMaximized: {
        marginBottom: uploadDrawerMaxHeight,
    },
}));

const PageContent = ({ children }) => {
    const classes = useStyles();
    const tracker = useUploadTrackingState();

    return (
        <div className={classes.root}>
            <div
                className={clsx(classes.content, {
                    [classes.contentUploadMinimized]:
                        tracker.showQueue && tracker.queueMinimized,
                    [classes.contentUploadMaximized]:
                        tracker.showQueue && !tracker.queueMinimized,
                })}
            >
                {children}
            </div>
            <div className={classes.drawerContainer}>
                <UploadsQueue />
            </div>
        </div>
    );
};

export default PageContent;
