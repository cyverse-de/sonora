import React, { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import { useQuery } from "react-query";

import { bootstrap } from "../../serviceFacades/users";
import { getResourceDetails } from "../../serviceFacades/filesystem";
import ErrorHandler from "../utils/error/ErrorHandler";
import GridLoading from "../utils/GridLoading";
import General from "./General";
import Shortcuts from "./Shortcuts";
import styles from "./styles";

import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

export default function Preferences(props) {
    const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(
        false
    );
    const [userPref, setUserPref] = useState();
    const [fetchDetailsKey, setFetchDetailsKey] = useState("");
    const [bootStrapError, setBootStrapError] = useState(null);
    const [defaultOutputFolder, setDefaultOutputFolder] = useState(null);
    const [
        outputFolderValidationError,
        setOutputFolderValidationError,
    ] = useState(null);
    const classes = useStyles();

    const { isFetching } = useQuery({
        queryKey: "bootstrap",
        queryFn: bootstrap,
        config: {
            onSuccess: (respData) => {
                let pref = respData.preferences;
                pref.defaultOutputFolder =
                    pref.default_output_folder?.path ||
                    pref.system_default_output_dir.path;
                setDefaultOutputFolder(pref.defaultOutputFolder);
                console.log(JSON.stringify(pref));
                setUserPref(pref);
            },
            onError: (e) => setBootStrapError(e),
        },
    });

    useEffect(() => {
        if (defaultOutputFolder) {
            setFetchDetailsKey([
                "dataResourceDetails",
                { paths: [defaultOutputFolder] },
            ]);
        }
    }, [defaultOutputFolder]);

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: getResourceDetails,
        config: {
            onSuccess: (resp) => {
                const details = resp?.paths[defaultOutputFolder];
                if (details?.permission !== "own") {
                    console.log("permission=>" + details.permission);
                    setOutputFolderValidationError(
                        "You don't have access to this folder."
                    );
                } else {
                    setOutputFolderValidationError(null);
                }
            },
        },
        onError: (e) => {
            console.log("error getting stats");
            setOutputFolderValidationError(
                "You don't have access to this folder."
            );
        },
    });

    const handleSubmit = (values, actions) => {
        actions.setSubmitting = true;
        console.log(values);
    };

    const restoreDefaults = (setFieldValue) => (event) => {
        console.log(
            "defaultAnalysesFolder => " +
                userPref.system_default_output_dir.path
        );
        setFieldValue("rememberLastPath", true);
        setFieldValue("saveSession", true);
        setFieldValue("enableImportEmailNotification", true);
        setFieldValue("enableWaitTimeMessage", true);
        setFieldValue("enableAnalysisEmailNotification", true);
        setFieldValue("enableHPCPrompt", true);
        setFieldValue("notificationKBShortcut", "N");
        setFieldValue("dataKBShortcut", "D");
        setFieldValue("closeKBShortcut", "Q");
        setFieldValue("appsKBShortcut", "A");
        setFieldValue("analysisKBShortcut", "Y");
        setFieldValue(
            "defaultOutputFolder",
            userPref.system_default_output_dir.path
        );
        setShowRestoreConfirmation(false);
    };

    const setDefaultFolder = (setFieldValue, newFolder) => {
        setFieldValue("defaultOutputFolder", newFolder);
        setDefaultOutputFolder(newFolder);
    };

    if (bootStrapError) {
        return (
            <ErrorHandler errorObject={bootStrapError} baseId="preferences" />
        );
    }

    if (isFetching && !userPref) {
        return (
            <>
                <GridLoading rows={5} />
                <Divider className={classes.dividers} />
                <GridLoading rows={1} />
                <Divider className={classes.dividers} />
                <GridLoading rows={1} />
                <Divider className={classes.dividers} />
                <GridLoading rows={5} />
            </>
        );
    }

    return (
        <Container className={classes.root}>
            <Paper>
                <Formik
                    initialValues={userPref}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form>
                            <General
                                defaultOutputFolder={defaultOutputFolder}
                                isValidating={isFetchingStat}
                                onNewDefaultOutputFolder={(newFolder) => {
                                    console.log(
                                        "new default output folder=>" +
                                            newFolder
                                    );
                                    setDefaultFolder(
                                        props.setFieldValue,
                                        newFolder
                                    );
                                }}
                                outputFolderValidationError={
                                    outputFolderValidationError
                                }
                            />
                            <Divider className={classes.dividers} />
                            <Shortcuts />
                            <Grid container justify="flex-end" spacing={3}>
                                <Grid item>
                                    <Button
                                        className={classes.actionButton}
                                        color="primary"
                                        onClick={() =>
                                            setShowRestoreConfirmation(true)
                                        }
                                    >
                                        Restore Defaults
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        className={classes.actionButton}
                                        color="primary"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                            <Dialog
                                open={showRestoreConfirmation}
                                onClose={() =>
                                    setShowRestoreConfirmation(false)
                                }
                            >
                                <DialogTitle>Restore Defaults</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you would like to restore
                                        defaults?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={restoreDefaults(
                                            props.setFieldValue
                                        )}
                                        color="primary"
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setShowRestoreConfirmation(false)
                                        }
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}
