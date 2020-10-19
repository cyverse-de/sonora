import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    makeStyles,
    Typography,
} from "@material-ui/core";

import { Cancel as CancelIcon, Close, FileCopy } from "@material-ui/icons";

import {
    announce,
    AnnouncerConstants,
    build as buildID,
} from "@cyverse-de/ui-lib";

import { useTranslation } from "i18n";

import { getHost } from "components/utils/getHost";
import constants from "components/Bag/constants";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    help: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    paper: {
        width: theme.spacing(60),
        height: theme.spacing(70),
    },
}));

const DownloadLinksDialog = ({
    paths = [],
    open = false,
    fullScreen = false,
    onClose = () => {},
    showErrorAnnouncer,
}) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);
    const dialogID = buildID(constants.DOWNLOAD_BASEID, constants.DIALOG);

    const handleClose = (event) => {
        event.preventDefault();
        event.stopPropagation();

        onClose();
    };

    const handleCopy = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const linksString = paths.reduce((acc, curr) => {
            const fullLink = `${getHost()}/api/download?path=${curr}`;
            if (acc !== "") {
                acc = `${acc}\n${fullLink}`;
            } else {
                acc = fullLink;
            }
            return acc;
        }, "");

        navigator.clipboard
            .writeText(linksString)
            .then(() => {
                announce({
                    text: t("copyToClipboardSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
            })
            .catch((err) => showErrorAnnouncer(t("copyToClipboardError", err)));
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            classes={{ paper: classes.paper }}
            id={dialogID}
        >
            <DialogTitle>
                {t("downloadLinks")}

                <Typography
                    component="p"
                    variant="body1"
                    color="textSecondary"
                    classes={{ root: classes.help }}
                    id={buildID(dialogID, constants.TITLE, constants.HELP)}
                >
                    {t("downloadLinksDescription")}
                </Typography>

                <IconButton
                    onClick={handleClose}
                    className={classes.closeButton}
                    id={buildID(
                        dialogID,
                        constants.TITLE,
                        constants.CLOSE,
                        constants.BUTTON
                    )}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <List dense={true}>
                    {paths.map((path, index) => {
                        const linkID = buildID(dialogID, constants.LINK, index);
                        return (
                            <ListItem id={linkID} key={linkID}>
                                <a
                                    download={path.substring(
                                        path.lastIndexOf("/") + 1
                                    )}
                                    href={`${getHost()}/api/download?path=${path}`}
                                >
                                    {path}
                                </a>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>

            <DialogActions>
                {fullScreen ? (
                    <IconButton
                        onClick={handleClose}
                        id={buildID(
                            dialogID,
                            constants.CANCEL,
                            constants.BUTTON
                        )}
                    >
                        <CancelIcon />
                    </IconButton>
                ) : (
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.button}
                        startIcon={<CancelIcon />}
                        onClick={handleClose}
                        size="small"
                        id={buildID(
                            dialogID,
                            constants.CANCEL,
                            constants.BUTTON
                        )}
                    >
                        {t("close")}
                    </Button>
                )}

                {fullScreen ? (
                    <IconButton
                        onClick={handleCopy}
                        id={buildID(dialogID, constants.COPY, constants.BUTTON)}
                    >
                        <FileCopy />
                    </IconButton>
                ) : (
                    <Button
                        onClick={handleCopy}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<FileCopy />}
                        size="small"
                        id={buildID(dialogID, constants.COPY, constants.BUTTON)}
                    >
                        {t("copyToClipboard")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default withErrorAnnouncer(DownloadLinksDialog);
