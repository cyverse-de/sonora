/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";

import ids from "../ids";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Close } from "@mui/icons-material";
import ListSavedLaunches from "./SavedLaunchListing";

const useStyles = makeStyles()((theme) => ({
    closeButton: {
        float: "right",
    },
}));

export default function SavedLaunchDialog(props) {
    const { baseDebugId, appName, appId, systemId, open, onClose } = props;
    const { t } = useTranslation("apps");

    const { classes } = useStyles();

    return (
        <Dialog open={open}>
            <DialogTitle>
                {t("savedLaunch")} - {appName}
                <IconButton
                    className={classes.closeButton}
                    aria-label={t("cancelLabel")}
                    onClick={onClose}
                    size="small"
                    edge="end"
                    id={buildID(baseDebugId, ids.CLOSE_BTN)}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent id={buildID(baseDebugId, ids.DIALOG)}>
                <ListSavedLaunches
                    appId={appId}
                    systemId={systemId}
                    baseDebugId={baseDebugId}
                />
            </DialogContent>
        </Dialog>
    );
}
