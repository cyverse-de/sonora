/**
 * A general purpose dialog
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

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
        ...dialogProps
    } = props;
    const { t } = useTranslation("common");
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const dialogTitleId = buildID(baseId, ids.DIALOG.TITLE);
    return (
        <Dialog
            id={baseId}
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            aria-labelledby={dialogTitleId}
            {...dialogProps}
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
                    size="large"
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
