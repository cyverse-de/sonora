/**
 * A general purpose dialog
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

function DEDialog(props) {
    const {
        baseId,
        open,
        title,
        onClose,
        actions,
        maxWidth = "sm",
        fullWidth = true,
        children,
    } = props;
    const { t } = useTranslation("common");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const dialogTitleId = build(baseId, ids.DIALOG.TITLE);
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
        >
            <DialogTitle id={dialogTitleId}>
                {title}
                <IconButton
                    aria-label={t("close")}
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        right: theme.spacing(0.5),
                        top: theme.spacing(0.5),
                        margin: 0,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            {actions && <DialogActions>{actions}</DialogActions>}
        </Dialog>
    );
}

export default DEDialog;
