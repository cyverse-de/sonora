import React, { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import { useQuery, queryCache, useMutation } from "react-query";
import { injectIntl } from "react-intl";

import ids from "./ids";
import messages from "./messages";
import constants from "../../constants";
import prefConstants from "./constants";
import General from "./General";
import Shortcuts from "./Shortcuts";
import styles from "./styles";
import { isWritable } from "../data/utils";
import { bootstrap, savePreferences } from "../../serviceFacades/users";
import { getResourceDetails } from "../../serviceFacades/filesystem";
import ErrorHandler from "../utils/error/ErrorHandler";
import GridLoading from "../utils/GridLoading";

import {
    announce,
    build,
    getMessage,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
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

function Preferences(props) {
    const { baseId, intl } = props;
    const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(
        false
    );
    const [userPref, setUserPref] = useState({});
    const [fetchDetailsKey, setFetchDetailsKey] = useState("");
    const [bootstrapError, setBootstrapError] = useState(null);
    const [defaultOutputFolder, setDefaultOutputFolder] = useState(null);
    const [requireAgaveAuth, setRequireAgaveAuth] = useState(true);
    const [
        outputFolderValidationError,
        setOutputFolderValidationError,
    ] = useState(null);
    const [bootstrapKey, setBootstrapKey] = useState("");

    const classes = useStyles();

    const preProcessData = (respData) => {
        let pref = respData.preferences;
        pref.defaultOutputFolder =
            pref.default_output_folder?.path ||
            pref.system_default_output_dir.path;
        setDefaultOutputFolder(pref.defaultOutputFolder);
        setBootstrapKey(null);
        console.log(JSON.stringify(pref));
        setUserPref(pref);
        const session = respData?.session;
        const agaveKey = session?.auth_redirect?.agave;
        setRequireAgaveAuth(!agaveKey);
    };

    useEffect(() => {
        //get from cache if not fetch now.
        const prefCache = queryCache.getQueryData("bootstrap");
        if (prefCache) {
            preProcessData(prefCache);
        } else {
            setBootstrapKey("bootstrap");
        }
    }, [userPref]);

    const { isFetching } = useQuery({
        queryKey: bootstrapKey,
        queryFn: bootstrap,
        config: {
            onSuccess: (respData) => preProcessData(respData),
            onError: (e) => setBootstrapError(e),
            staleTime: Infinity,
            cacheTime: Infinity,
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

    const [preferences, { status: prefMutationStatus }] = useMutation(
        savePreferences,
        {
            onSuccess: (updatedPref) => {
                //update preference in cache
                queryCache.setQueryData("bootstrap", (bootstrapData) => {
                    console.log("updated pref=>" + JSON.stringify(updatedPref));
                    console.log(
                        "bootstrap data=>" + JSON.stringify(bootstrapData)
                    );
                    if (bootstrapData && updatedPref) {
                        const updatedBootstrap = {
                            ...bootstrapData,
                            preferences: { ...updatedPref.preferences },
                        };
                        console.log(
                            "updated bootstrap data=>" +
                                JSON.stringify(updatedBootstrap)
                        );
                        return updatedBootstrap;
                    } else {
                        return bootstrapData;
                    }
                });
            },
            onError: (e) => {
                setBootstrapError(e);
            },
        }
    );

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: getResourceDetails,
        config: {
            onSuccess: (resp) => {
                const details = resp?.paths[defaultOutputFolder];
                if (!isWritable(details?.permission)) {
                    console.log("permission=>" + details.permission);
                    setOutputFolderValidationError(
                        formatMessage(intl, "permissionSelectErrorMessage")
                    );
                } else {
                    setOutputFolderValidationError(null);
                }
            },
        },
        onError: (e) => {
            console.log("error getting stats");
            setOutputFolderValidationError(
                formatMessage(intl, "permissionSelectErrorMessage")
            );
        },
    });

    const handleSubmit = (values, actions) => {
        if (outputFolderValidationError) {
            console.log("validation error");
            announce({
                text: formatMessage(intl, "validationMessage"),
            });
        } else {
            const updatedPref = values;
            updatedPref.default_output_folder.id = values.defaultOutputFolder;
            updatedPref.default_output_folder.path = values.defaultOutputFolder;
            preferences(updatedPref);
        }
        console.log(values);
    };

    const restoreDefaults = (setFieldValue) => (event) => {
        console.log(
            "default_output_folder.path => " +
                userPref.system_default_output_dir.path
        );
        setFieldValue(prefConstants.keys.REMEMBER_LAST_PATH, true);
        setFieldValue(
            prefConstants.keys.ENABLE_ANALYSIS_EMAIL_NOTIFICATION,
            true
        );
        setFieldValue(prefConstants.keys.ENABLE_WAIT_TIME_MESSAGE, true);
        setFieldValue(
            prefConstants.keys.ENABLE_IMPORT_EMAIL_NOTIFICATION,
            true
        );
        setFieldValue(prefConstants.keys.ENABLE_HPC_PROMPT, true);
        setFieldValue(
            prefConstants.keys.NOTIFICATION_KB_SC,
            prefConstants.defaults.NOTIFICATION_SC
        );
        setFieldValue(
            prefConstants.keys.DATA_KB_SC,
            prefConstants.defaults.DATA_SC
        );
        setFieldValue(
            prefConstants.keys.APPS_KB_SC,
            prefConstants.defaults.APPS_SC
        );
        setFieldValue(
            prefConstants.keys.ANALYSES_KB_SC,
            prefConstants.defaults.ANALYSES_SC
        );
        setFieldValue(
            prefConstants.keys.DEFAULT_OUTPUT_FOLDER,
            userPref.system_default_output_dir.path
        );
        setShowRestoreConfirmation(false);
    };

    const setDefaultFolder = (setFieldValue, newFolder) => {
        setFieldValue(prefConstants.keys.DEFAULT_OUTPUT_FOLDER, newFolder);
        setDefaultOutputFolder(newFolder);
    };

    if (bootstrapError) {
        return (
            <ErrorHandler errorObject={bootstrapError} baseId="preferences" />
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
    const validateShortCuts = (values, props) => {
        const errors = {};
        let kbMap = new Map();
        kbMap.set(
            prefConstants.keys.APPS_KB_SC,
            values[prefConstants.keys.APPS_KB_SC]
        );
        kbMap.set(
            prefConstants.keys.DATA_KB_SC,
            values[prefConstants.keys.DATA_KB_SC]
        );
        kbMap.set(
            prefConstants.keys.ANALYSES_KB_SC,
            values[prefConstants.keys.ANALYSES_KB_SC]
        );
        kbMap.set(
            prefConstants.keys.NOTIFICATION_KB_SC,
            values[prefConstants.keys.NOTIFICATION_KB_SC]
        );
        for (let [key1] of kbMap) {
            for (let [key2] of kbMap) {
                if (key1 !== key2) {
                    if (kbMap.get(key1) === kbMap.get(key2)) {
                        errors[key1] = formatMessage(
                            intl,
                            "duplcateShortcutError"
                        );
                        errors[key2] = formatMessage(
                            intl,
                            "duplcateShortcutError"
                        );
                    }
                }
            }
        }
        return errors;
    };

    return (
        <>
            {prefMutationStatus === constants.LOADING && (
                <CircularProgress
                    size={30}
                    thickness={5}
                    style={{ position: "absolute", top: "50%", left: "50%" }}
                />
            )}
            <Container className={classes.root}>
                <Paper>
                    <Formik
                        initialValues={userPref}
                        onSubmit={handleSubmit}
                        enableReinitialize
                        validate={validateShortCuts}
                        validateOnChange={true}
                    >
                        {(props) => (
                            <Form>
                                <General
                                    baseId={build(baseId, ids.GENERAL)}
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
                                    requireAgaveAuth={requireAgaveAuth}
                                />
                                <Divider className={classes.dividers} />
                                <Shortcuts
                                    baseId={build(baseId, ids.KB_SHORTCUTS)}
                                />
                                <Grid container justify="flex-end" spacing={3}>
                                    <Grid item>
                                        <Button
                                            id={build(
                                                baseId,
                                                ids.RESTORE_DEFAULT_BUTTON
                                            )}
                                            className={classes.actionButton}
                                            color="primary"
                                            onClick={() =>
                                                setShowRestoreConfirmation(true)
                                            }
                                        >
                                            {getMessage(
                                                "restoreDefaultsBtnLbl"
                                            )}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            id={build(
                                                baseId,
                                                ids.SAVE_PREFERENCES_BUTTON
                                            )}
                                            className={classes.actionButton}
                                            color="primary"
                                            type="submit"
                                        >
                                            {getMessage("saveBtnLbl")}
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
                                            {getMessage("restoreConfirmation")}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            id={build(baseId, ids.OK_BUTTON)}
                                            onClick={restoreDefaults(
                                                props.setFieldValue
                                            )}
                                            color="primary"
                                        >
                                            {getMessage("okBtnLbl")}
                                        </Button>
                                        <Button
                                            id={build(
                                                baseId,
                                                ids.CANCEL_BUTTON
                                            )}
                                            onClick={() =>
                                                setShowRestoreConfirmation(
                                                    false
                                                )
                                            }
                                            color="primary"
                                        >
                                            {getMessage("cancelBtnLbl")}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Container>
        </>
    );
}

export default withI18N(injectIntl(Preferences), messages);
