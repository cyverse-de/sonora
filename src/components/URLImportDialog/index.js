import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import PublishIcon from "@material-ui/icons/Publish";
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
        alignItems: "center", // without this the import button balloons in size vertically.

        // Align things vertically on mobile.
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
            flexDirection: "column",
        },
    },
    urlField: {
        width: "100%",
        margin: "0 10px 0 0",

        [theme.breakpoints.down("sm")]: {
            margin: 0, // The textbox shifts to the left without this.
        },
    },
    closeDialog: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.blueGrey,
    },
    importDefault: {
        background: theme.palette.primary.main,
        marginBottom: 25,

        [theme.breakpoints.down("sm")]: {
            width: "100%", // Easier to hit on mobile.
            marginTop: 10,
            marginBottom: 0,
        },
    },
    importError: {
        background: theme.palette.error.main,
        marginBottom: 25,

        // Hover colors get weird after switching to error
        // without this.
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
        },

        [theme.breakpoints.down("sm")]: {
            width: "100%", // Easier to hit on mobile.
            marginTop: 10,
            marginBottom: 0,
        },
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

        if (!["http:", "https:", "ftp:"].includes(u.protocol)) {
            retval = false;
        }
    } catch (e) {
        retval = false;
    } finally {
        return retval;
    }
};

const URLImportTextField = (props) => {
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
            <Button
                aria-label={fmt(intl, "importButtonAriaLabel")}
                onClick={(e) => {
                    if (isValidURL) {
                        setupEvent(e);
                        clickHandler(e);
                        setHasFirstFocused(false);
                    }
                }}
                color="primary"
                classes={{
                    root: !errored
                        ? classes.importDefault
                        : classes.importError,
                }}
                id={buildID(ids.BASE_ID, ids.IMPORT_BUTTON)}
                startIcon={<PublishIcon />}
                variant="contained"
            >
                {fmt(intl, "importButtonText")}
            </Button>
        </div>
    );
};

const URLImportDialog = (props) => {
    const [open, setOpen] = useState(props.open || false);
    const classes = useStyles();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
                {!isSmall ? ( // The close button looks weird on small screens.
                    <IconButton
                        aria-label="close"
                        className={classes.closeDialog}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : (
                    ""
                )}
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
