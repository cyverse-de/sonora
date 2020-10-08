/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import ListQuickLaunches from "./QuickLaunchListing";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        float: "right",
    },
}));

export default function QuickLaunchDialog(props) {
    const { baseDebugId, appName, appId, systemId, dialogOpen, onHide } = props;
    const { t } = useTranslation("apps");

    const classes = useStyles();

    return (
        <Dialog open={dialogOpen}>
            <DialogTitle>
                {appName}
                <IconButton
                    className={classes.closeButton}
                    aria-label={t("cancelLabel")}
                    onClick={onHide}
                    size="small"
                    edge="end"
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ListQuickLaunches
                    appId={appId}
                    systemId={systemId}
                    baseDebugId={baseDebugId}
                />
            </DialogContent>
        </Dialog>
    );
}
