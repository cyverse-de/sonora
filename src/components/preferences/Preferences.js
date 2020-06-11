import React, { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import { useQuery } from "react-query";

import { useConfig } from "../../contexts/config";
import { useUserProfile } from "../../contexts/userProfile";
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
    const [restoreDef, setRestoreDef] = useState(false);
    const [defaultAnalysesFolder, setDefaultAnalysesFolder] = useState();
    const [userPref, setUserPref] = useState();
    const [fetchDetailsKey, setFetchDetailsKey] = useState("");
    const classes = useStyles();
    const [clientConfig] = useConfig();
    const [userProfile] = useUserProfile();
    const [error, setError] = useState(null);

    const { isFetching } = useQuery({
        queryKey: "bootstrap",
        queryFn: bootstrap,
        config: {
            onSuccess: (respData) => {
                let pref = respData.preferences;
                pref.defaultOutputFolder =
                    pref.default_output_folder?.path ||
                    pref.system_default_output_dir.path;
                console.log(
                    "default output folder from service=>" +
                        pref.defaultOutputFolder
                );
                setUserPref(pref);
            },
            onError: (e) => setError(e),
        },
    });

    useEffect(() => {
        if (userPref?.defaultOutputFolder) {
            setFetchDetailsKey([
                "dataResourceDetails",
                { paths: [userPref?.defaultOutputFolder] },
            ]);
        }
    }, [userPref]);

    const { isFetching: isStatFetching } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: getResourceDetails,
        config: {
            onSuccess: (resp) => {
                const details = resp?.paths[userPref?.defaultOutputFolder];
                console.log("details =>" + details);
            },
            onError: (e) => {
                console.log("error getting stats");
            },
        },
    });

    useEffect(() => {
        if (clientConfig?.irods && userProfile?.id) {
            console.log(
                "default folder=>" +
                    clientConfig.irods.home_path +
                    "/" +
                    userProfile.id +
                    "/" +
                    clientConfig.analyses.default_folder_name
            );
            setDefaultAnalysesFolder(
                clientConfig.irods.home_path +
                    "/" +
                    userProfile.id +
                    "/" +
                    clientConfig.analyses.default_folder_name
            );
        }
    }, [clientConfig, userProfile]);

    const handleSubmit = (values, actions) => {
        actions.setSubmitting = true;
        console.log(values);
    };

    const restoreDefaults = (setFieldValue) => (event) => {
        console.log("defaultAnalysesFolder => " + defaultAnalysesFolder);
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
        setFieldValue("defaultOutputFolder", defaultAnalysesFolder);
        setRestoreDef(false);
    };

    if (error) {
        return <ErrorHandler errorObject={error} baseId="preferences" />;
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
        <Container style={{ overflowY: "auto" }}>
            <Paper className={classes.root}>
                <Formik initialValues={userPref} onSubmit={handleSubmit}>
                    {(props) => (
                        <Form>
                            <General
                                config={props}
                                defaultOutputFolder={
                                    userPref?.defaultOutputFolder
                                }
                                onNewDefaultOutputFolder={(newfolder) => {
                                    console.log(
                                        "new default output folder=>" +
                                            newfolder
                                    );
                                    userPref.defaultOutputFolder = newfolder;
                                }}
                            />
                            <Divider className={classes.dividers} />
                            <Shortcuts />
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Button
                                        className={classes.actionButton}
                                        color="primary"
                                        onClick={() => setRestoreDef(true)}
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
                                open={restoreDef}
                                onClose={() => setRestoreDef(false)}
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
                                        onClick={() => setRestoreDef(false)}
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
