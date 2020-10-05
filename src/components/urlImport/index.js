import React, { useState } from "react";
import { useMutation } from "react-query";

import { useTranslation } from "i18n";

import ids from "./ids";

import {
    ERROR_CODES,
    getErrorCode,
    getErrorData,
} from "components/utils/error/errorCode";

import constants from "../../constants";
import { uploadByUrl } from "serviceFacades/fileio";

import { build as buildID } from "@cyverse-de/ui-lib";

import { makeStyles } from "@material-ui/core/styles";
import {
    CheckCircle,
    Publish as PublishIcon,
    Close as CloseIcon,
    Error,
} from "@material-ui/icons";

import {
    Button,
    Dialog,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    useTheme,
    TextField,
    Typography,
} from "@material-ui/core";

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
        margin: theme.spacing(0, 2, 0, 0),

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

        [theme.breakpoints.down("sm")]: {
            width: "100%", // Easier to hit on mobile.
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(0),
        },
    },
    importError: {
        background: theme.palette.error.main,

        // Hover colors get weird after switching to error
        // without this.
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
        },

        [theme.breakpoints.down("sm")]: {
            width: "100%", // Easier to hit on mobile.
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(0),
        },
    },
    instructions: {
        marginBottom: theme.spacing(2),
    },
}));

const validURL = (possibleURL) => {
    let retval = true;

    try {
        const u = new URL(possibleURL);
        retval = ["http:", "https:", "ftp:"].includes(u.protocol);
    } catch (e) {
        retval = false;
    } finally {
        return retval;
    }
};

/**
 * Takes a URL string and returns just the file name without any query
 * params or tags.  This is how the DE's import job will name the file
 * as well.
 * @param urlString
 * @returns {string}
 */
const urlFileName = (urlString) =>
    urlString.split("/").pop().split("#")[0].split("?")[0];

const URLImportTextField = (props) => {
    const classes = useStyles();
    const { t } = useTranslation("urlImport");

    const [uploadURL, setUploadURL] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);

    const { path, successCallback, errorCallback } = props;

    const [importUrl, { status }] = useMutation(uploadByUrl, {
        onSuccess: (resp) => {
            successCallback(t("fileImportSubmitted"));
            errorCallback(null);
            setUploadURL("");
        },
        onError: (error) => {
            successCallback(null);
            const errorPath = getErrorData(error)?.path;
            const duplicateName = urlFileName(errorPath);
            const text =
                getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                    ? t("fileExists", {
                          name: duplicateName,
                          path: path,
                      })
                    : t("fileImportFail");
            errorCallback(text);
        },
    });

    const clickHandler = (event) => {
        importUrl({ dest: path, address: uploadURL });
        setIsValidURL(false);
        successCallback(null); //clear previous success msgs
        errorCallback(null); //clear previous error msgs
    };

    return (
        <div className={classes.container}>
            <TextField
                fullWidth
                id={buildID(ids.BASE_ID, ids.TEXT_FIELD)}
                placeholder={t("placeholder")}
                InputLabelProps={{
                    shrink: true,
                }}
                aria-label={t("textFieldAriaLabel")}
                className={classes.urlField}
                value={uploadURL}
                InputProps={{
                    endAdornment: (
                        <>
                            {status === constants.LOADING ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : null}
                        </>
                    ),
                }}
                onBlur={(e) => {
                    successCallback(null);
                    errorCallback(null);
                }}
                onChange={(e) => {
                    const possibleUploadURL = e.target.value.trim();
                    setIsValidURL(validURL(possibleUploadURL));
                    setUploadURL(possibleUploadURL);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidURL) {
                        clickHandler(e);
                    }
                }}
            />
            <Button
                aria-label={t("importButtonAriaLabel")}
                onClick={(e) => {
                    if (isValidURL) {
                        clickHandler(e);
                    } else {
                        errorCallback(t("instructions"));
                    }
                }}
                color="primary"
                classes={{
                    root: classes.importDefault,
                }}
                id={buildID(ids.BASE_ID, ids.IMPORT_BUTTON)}
                startIcon={<PublishIcon />}
                variant="contained"
            >
                {t("importButtonText")}
            </Button>
        </div>
    );
};

const URLImportDialog = (props) => {
    const classes = useStyles();
    const { t } = useTranslation("urlImport");
    const theme = useTheme();
    const { open, onClose, path } = props;

    const [submittedMsg, setSubmittedMsg] = useState();
    const [errorMsg, setErrorMsg] = useState();

    return (
        <Dialog
            fullWidth={true}
            maxWidth="sm"
            open={open}
            onClose={onClose}
            aria-labelledby={buildID(ids.BASE_ID, ids.TITLE)}
        >
            <DialogTitle id={buildID(ids.BASE_ID, ids.TITLE)}>
                {t("title")}
                <IconButton
                    aria-label="close"
                    className={classes.closeDialog}
                    onClick={() => {
                        setSubmittedMsg("");
                        setErrorMsg("");
                        onClose();
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography className={classes.instructions}>
                    {t("instructions")}
                </Typography>

                <URLImportTextField
                    path={path}
                    successCallback={(msg) => setSubmittedMsg(msg)}
                    errorCallback={(msg) => setErrorMsg(msg)}
                />
                {submittedMsg && (
                    <>
                        <div style={{ float: "left" }}>
                            <CheckCircle
                                size="small"
                                style={{ color: theme.palette.info.main }}
                            />
                        </div>
                        <Typography variant="caption">
                            {submittedMsg}
                        </Typography>
                    </>
                )}
                {errorMsg && (
                    <>
                        <div style={{ float: "left" }}>
                            <Error size="small" color="error" />
                        </div>
                        <Typography variant="caption">{errorMsg}</Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => {
                        setSubmittedMsg("");
                        setErrorMsg("");
                        onClose();
                    }}
                    className={classes.close}
                    id={buildID(ids.BASE_ID, ids.CLOSE_DIALOG)}
                    aria-label={t("doneButtonAriaLabel")}
                >
                    {t("doneButtonText")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default URLImportDialog;
