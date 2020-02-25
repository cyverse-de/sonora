/**
 * @author johnworth
 *
 * The Upload Queue toolbar.
 *
 * @module UploadQueue
 */

import React from "react";

import { IconButton, Toolbar, Typography } from "@material-ui/core";

import {
    Cancel as CancelIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";

import useStyles from "./styles";

export default function UploadsToolbar({
    isMaximized,
    setIsMaximized,
    onClose,
}) {
    const classes = useStyles();

    return (
        <div className={classes.toolBarRoot}>
            <Toolbar
                variant="dense"
                color="primary"
                className={classes.toolBar}
            >
                <Typography variant="h6" className={classes.uploadTypography}>
                    Uploads
                </Typography>

                <IconButton onClick={() => setIsMaximized(!isMaximized)}>
                    {isMaximized ? (
                        <KeyboardArrowDownIcon
                            className={classes.toolBarAction}
                        />
                    ) : (
                        <KeyboardArrowUpIcon
                            className={classes.toolBarAction}
                        />
                    )}
                </IconButton>

                <IconButton onClick={onClose}>
                    <CancelIcon className={classes.toolBarAction} />
                </IconButton>
            </Toolbar>
        </div>
    );
}
