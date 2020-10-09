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
    const { baseDebugId, appName, appId, systemId, open, onClose } = props;
    const { t } = useTranslation("apps");

    const classes = useStyles();

    return (
        <Dialog open={open}>
            <DialogTitle>
                {appName}
                <IconButton
                    className={classes.closeButton}
                    aria-label={t("cancelLabel")}
                    onClick={onClose}
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
