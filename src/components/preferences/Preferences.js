/**
 * @author Jack Mitt, sriram
 *
 *  Diaplay user preferences.
 *
 *
 */
import React, { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import { useQuery, queryCache, useMutation } from "react-query";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

import ids from "./ids";

import constants from "../../constants";
import prefConstants from "./constants";
import General from "./General";
import Shortcuts from "./Shortcuts";
import styles from "./styles";

import { isWritable } from "../data/utils";
import NavigationConstants from "../../common/NavigationConstants";

import {
    bootstrap,
    getRedirectURIs,
    savePreferences,
    resetToken,
    BOOTSTRAP_KEY,
    REDIRECT_URI_QUERY_KEY,
} from "../../serviceFacades/users";
import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "../../serviceFacades/filesystem";
import GridLoading from "../utils/GridLoading";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";

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
    const { baseId, intl, showErrorAnnouncer } = props;

    const { t } = useTranslation("preferences");

    const router = useRouter();

    const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(
        false
    );
    const [userPref, setUserPref] = useState({});
    const [fetchDetailsKey, setFetchDetailsKey] = useState(
        DATA_DETAILS_QUERY_KEY
    );
    const [fetchDetailsQueryEnabled, setFetchDetailsQueryEnabled] = useState(
        false
    );
    const [defaultOutputFolder, setDefaultOutputFolder] = useState(null);
    const [requireAgaveAuth, setRequireAgaveAuth] = useState(true);
    const [
        outputFolderValidationError,
        setOutputFolderValidationError,
    ] = useState(null);
    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [
        fetchRedirectURIsQueryEnabled,
        setFetchRedirectURIsQueryEnabled,
    ] = useState(false);
    const [hpcAuthUrl, setHPCAuthUrl] = useState("");

    const classes = useStyles();

    //get from cache if not fetch now.
    const prefCache = queryCache.getQueryData(BOOTSTRAP_KEY);

    const preProcessData = (respData) => {
        let pref = respData.preferences;
        setDefaultOutputFolder(
            pref?.default_output_folder?.path ||
                pref?.system_default_output_dir?.path
        );
        setBootstrapQueryEnabled(false);
        setUserPref(pref);
        const session = respData?.session;
        const agaveKey = session?.auth_redirect?.agave;
        if (agaveKey) {
            setRequireAgaveAuth(true);
        } else {
            setRequireAgaveAuth(false);
        }
    };
    useEffect(() => {
        if (prefCache) {
            preProcessData(prefCache);
        } else {
            setBootstrapQueryEnabled(true);
        }
    }, [prefCache]);

    useEffect(() => {
        if (defaultOutputFolder) {
            setFetchDetailsKey([
                DATA_DETAILS_QUERY_KEY,
                { paths: [defaultOutputFolder] },
            ]);
            setFetchDetailsQueryEnabled(true);
        } else {
            setFetchDetailsQueryEnabled(false);
        }
    }, [defaultOutputFolder]);

    useEffect(() => {
        if (hpcAuthUrl) {
            window.location.replace(hpcAuthUrl);
        }
    }, [hpcAuthUrl]);

    useEffect(() => {
        if (bootstrapError) {
            const errorString = JSON.stringify(bootstrapError);
            setBootstrapError(null);
            router.push(
                `/${NavigationConstants.ERROR}?errorInfo=` + errorString
            );
        }
    }, [bootstrapError, router]);

    const { isFetching } = useQuery({
        queryKey: BOOTSTRAP_KEY,
        queryFn: bootstrap,
        config: {
            enabled: bootstrapQueryEnabled,
            onSuccess: (respData) => preProcessData(respData),
            onError: (e) => {
                setBootstrapError(e);
            },
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    });

    const [preferences, { status: prefMutationStatus }] = useMutation(
        savePreferences,
        {
            onSuccess: (updatedPref) => {
                announce({
                    text: t("prefSaveSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                //update preference in cache
                queryCache.setQueryData(BOOTSTRAP_KEY, (bootstrapData) => {
                    if (bootstrapData && updatedPref) {
                        const updatedBootstrap = {
                            ...bootstrapData,
                            preferences: { ...updatedPref.preferences },
                        };
                        return updatedBootstrap;
                    } else {
                        return bootstrapData;
                    }
                });
            },
            onError: (e) => {
                showErrorAnnouncer(t("savePrefError"), e);
            },
        }
    );

    const [resetHPCToken, { status: resetTokenStatus }] = useMutation(
        resetToken,
        {
            onSuccess: () => {
                announce({
                    text: t("resetTokenSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                setFetchRedirectURIsQueryEnabled(true);
                setRequireAgaveAuth(true);
            },
            onError: (e) => {
                showErrorAnnouncer(t("resetTokenError"), e);
            },
        }
    );

    const { isFetching: isFetchingURIs } = useQuery({
        queryKey: REDIRECT_URI_QUERY_KEY,
        queryFn: getRedirectURIs,
        config: {
            enabled: fetchRedirectURIsQueryEnabled,
            onSuccess: (resp) => {
                setFetchRedirectURIsQueryEnabled(false);
                const redirectUrl = resp[constants.AGAVE_SYSTEM_ID];
                if (redirectUrl) {
                    setHPCAuthUrl(redirectUrl);
                }
            },
            onError: (e) => {
                showErrorAnnouncer(t(intl, "redirectError"), e);
            },
        },
    });

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: getResourceDetails,
        config: {
            enabled: fetchDetailsQueryEnabled,
            onSuccess: (resp) => {
                const details = resp?.paths[defaultOutputFolder];
                if (!isWritable(details?.permission)) {
                    setOutputFolderValidationError(
                        t("permissionSelectErrorMessage")
                    );
                } else {
                    setOutputFolderValidationError(null);
                }
            },
        },
        onError: (e) => {
            setOutputFolderValidationError(t("permissionSelectErrorMessage"));
        },
    });

    const handleSubmit = (values) => {
        //prevent dupe submission
        if (prefMutationStatus !== constants.LOADING) {
            if (outputFolderValidationError) {
                announce({
                    text: t("validationMessage"),
                });
            } else {
                const updatedPref = values;
                updatedPref.default_output_folder.id =
                    values.defaultOutputFolder;
                updatedPref.default_output_folder.path =
                    values.defaultOutputFolder;
                preferences(updatedPref);
            }
        }
    };

    const restoreDefaults = (setFieldValue) => (event) => {
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
                        errors[key2] = t("duplicateShortcutError");
                    } else if (!kbMap.get(key1)) {
                        errors[key1] = t("requiredShortcutError");
                    }
                }
            }
        }
        return errors;
    };
    const busy =
        prefMutationStatus === constants.LOADING ||
        resetTokenStatus === constants.LOADING ||
        isFetchingURIs;
    return (
        <>
            {busy && (
                <CircularProgress
                    id={build(baseId, ids.LOADING_PROGRESS)}
                    size={30}
                    thickness={5}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <Container className={classes.root}>
                <Paper>
                    <Formik
                        initialValues={userPref}
                        onSubmit={handleSubmit}
                        enableReinitialize
                        validate={validateShortCuts}
                    >
                        {(props) => (
                            <Form
                                aria-busy={busy}
                                aria-describedby={build(
                                    baseId,
                                    ids.LOADING_PROGRESS
                                )}
                            >
                                <General
                                    baseId={build(baseId, ids.GENERAL)}
                                    defaultOutputFolder={defaultOutputFolder}
                                    isValidating={isFetchingStat}
                                    onNewDefaultOutputFolder={(newFolder) => {
                                        setDefaultFolder(
                                            props.setFieldValue,
                                            newFolder
                                        );
                                    }}
                                    outputFolderValidationError={
                                        outputFolderValidationError
                                    }
                                    requireAgaveAuth={requireAgaveAuth}
                                    resetHPCToken={resetHPCToken}
                                />
                                <Divider className={classes.dividers} />
                                <Shortcuts
                                    baseId={build(baseId, ids.KB_SHORTCUTS)}
                                />
                                <Grid container justify="flex-end">
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
                                            {t("restoreDefaultsBtnLbl")}
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
                                            {t("saveBtnLbl")}
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
                                            {t("restoreConfirmation")}
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
                                            {t("okBtnLbl")}
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
                                            {t("cancelBtnLbl")}
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

export default withErrorAnnouncer(Preferences);
