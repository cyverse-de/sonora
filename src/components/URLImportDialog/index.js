import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import UploadIcon from "mdi-react/UploadIcon";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import intlData from "./messages";
import ids from "./ids";

import {
    build as buildID,
    formatMessage as fmt,
    withI18N,
} from "@cyverse-de/ui-lib";

import { injectIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    close: {
        color: theme.palette.blueGrey,
    },
    container: {
        display: "flex",

        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
            flexDirection: "column",
        },
    },
    urlField: {
        width: "100%",
    },
    closeDialog: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.blueGrey,
    },
    importDefault: {
        color: theme.palette.primary.main,
    },
    importError: {
        color: theme.palette.error.main,
    },
}));

const setupEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

const validURL = (possibleURL) => {
    let retval = true;

    try {
        const u = new URL(possibleURL);

        if (
            !["http:", "https:", "ftp:", "sftp:", "ftps:"].includes(u.protocol)
        ) {
            retval = false;
        }
    } catch (e) {
        retval = false;
    } finally {
        return retval;
    }
};

const URLImportTextField = (props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const classes = useStyles();
    const [uploadURL, setUploadURL] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);
    const [hasFirstFocused, setHasFirstFocused] = useState(false);

    const { addURLFn, intl } = props;

    const errored = !isValidURL && hasFirstFocused;

    const clickHandler = (event) => {
        setupEvent(event);
        addURLFn(event, uploadURL);
        setUploadURL("");
        setIsValidURL(false);
    };

    return (
        <div className={classes.container}>
            <TextField
                fullWidth
                id={buildID(ids.BASE_ID, ids.TEXTFIELD)}
                placeholder={fmt(intl, "placeholder")}
                helperText={
                    isValidURL || (!isValidURL && !hasFirstFocused)
                        ? fmt(intl, "helperText")
                        : fmt(intl, "helperTextError")
                }
                InputLabelProps={{
                    shrink: true,
                }}
                aria-label={fmt(intl, "textFieldAriaLabel")}
                className={classes.urlField}
                error={errored}
                value={uploadURL}
                onFocus={(e) => {
                    setHasFirstFocused(true);
                }}
                onBlur={(e) => {
                    // If it's empty, we don't care if it's already been focused on.
                    if (uploadURL === "") {
                        setHasFirstFocused(false);
                    }
                }}
                onChange={(e) => {
                    setupEvent(e);

                    const possibleUploadURL = e.target.value.trim();

                    if (!validURL(possibleUploadURL)) {
                        setIsValidURL(false);
                    } else {
                        setIsValidURL(true);
                    }

                    // Could happen after submitting a URL with the 'Enter' key.
                    if (!hasFirstFocused) {
                        setHasFirstFocused(true);
                    }

                    setUploadURL(possibleUploadURL);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidURL) {
                        setupEvent(e);
                        clickHandler(e);
                        setHasFirstFocused(false); // Prevents showing an error state after hitting Enter.
                    }
                }}
            />
            <IconButton
                aria-label={fmt(intl, "importButtonAriaLabel")}
                onClick={(e) => {
                    if (isValidURL) {
                        setupEvent(e);
                        clickHandler(e);
                    }
                }}
                color="primary"
                classes={{
                    root: !errored
                        ? classes.importDefault
                        : classes.importError,
                }}
                edge={isSmall ? false : "end"}
                id={buildID(ids.BASE_ID, ids.IMPORT_BUTTON)}
            >
                <UploadIcon />
            </IconButton>
        </div>
    );
};

const URLImportDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const classes = useStyles();
    const { addURLFn, intl } = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={handleClose}
            aria-labelledby={buildID(ids.BASE_ID, ids.TITLE)}
        >
            <DialogTitle id={buildID(ids.BASE_ID, ids.TITLE)}>
                {fmt(intl, "title")}
                <IconButton
                    aria-label="close"
                    className={classes.closeDialog}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <URLImportTextField intl={intl} addURLFn={addURLFn} />
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={handleClose}
                    className={classes.close}
                    id={buildID(ids.BASE_ID, ids.CLOSE_DIALOG)}
                    aria-label={fmt(intl, "doneButtonAriaLabel")}
                >
                    {fmt(intl, "doneButtonText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withI18N(injectIntl(URLImportDialog), intlData);
