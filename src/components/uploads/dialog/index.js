/**
 * @author johnworth
 *
 * A dialog displaying the tracked uploads.
 *
 * @module uploads/dialog
 */
import React from "react";
import { useTranslation } from "i18n";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { Close as CloseIcon } from "@mui/icons-material";
import buildID from "components/utils/DebugIDUtil";
import UploadQueue from "../queue";
import ids from "./ids";

const useStyles = makeStyles()((theme) => ({
    closeDialog: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.blueGrey,
    },
}));

/**
 * The upload dialog component that displays the list of uploads being tracked.
 *
 * @params {Object} props
 * @params {boolean} props.open - Whether or not the dialog is open.
 * @params {Object} props.handleClose - Callback that is executed when the dialog is closed.
 * @returns {Object}
 */
const UploadDialog = ({ open, handleClose = () => {} }) => {
    const { classes } = useStyles();
    const theme = useTheme();
    const { t } = useTranslation("upload");
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            id={ids.BASE}
        >
            <DialogTitle id={buildID(ids.BASE, ids.TITLE)}>
                {t("title")}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {t("help")}
                    <IconButton
                        aria-label={t("closeAria")}
                        id={buildID(ids.BASE, ids.CLOSE_X)}
                        className={classes.closeDialog}
                        onClick={handleClose}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogContentText>

                <UploadQueue id={buildID(ids.BASE, ids.LIST)} />
            </DialogContent>

            <DialogActions>
                <Button
                    id={buildID(ids.BASE, ids.CLOSE)}
                    onClick={handleClose}
                    variant="contained"
                    aria-label={t("closeAria")}
                >
                    {t("close")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadDialog;
