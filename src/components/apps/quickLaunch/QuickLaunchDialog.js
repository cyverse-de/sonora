/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import buildID from "components/utils/DebugIDUtil";

import ids from "../ids";

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
                {t("quickLaunch")} - {appName}
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
                <ListQuickLaunches
                    appId={appId}
                    systemId={systemId}
                    baseDebugId={baseDebugId}
                />
            </DialogContent>
        </Dialog>
    );
}
