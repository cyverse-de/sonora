/**
 * @author Jack Mitt, sriram
 *
 *  Allow users to edit / save their preferences.
 *
 *
 */
import React, { useCallback, useEffect, useState } from "react";

import { Form, Formik } from "formik";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useRouter } from "next/router";

import { useTranslation } from "i18n";

import ids from "./ids";

import constants from "../../constants";
import prefConstants from "./constants";
import General from "./General";
import styles from "./styles";
import Webhooks from "./Webhooks";
import { isWritable } from "../data/utils";

import { useBootstrapInfo } from "contexts/bootstrap";

import NavigationConstants from "common/NavigationConstants";

import {
    useBootStrap,
    getRedirectURIs,
    useSavePreferences,
    resetToken,
    getWebhookTopics,
    getWebhookTypes,
    BOOTSTRAP_KEY,
    REDIRECT_URI_QUERY_KEY,
    WEBHOOKS_TYPES_QUERY_KEY,
    WEBHOOKS_TOPICS_QUERY_KEY,
} from "serviceFacades/users";
import {
    getResourceDetails,
    DATA_DETAILS_QUERY_KEY,
} from "serviceFacades/filesystem";
import GridLoading from "components/utils/GridLoading";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

function Preferences(props) {
    const { baseId, showErrorAnnouncer } = props;

    const { t } = useTranslation("preferences");
    const router = useRouter();

    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();

    const [showRestoreConfirmation, setShowRestoreConfirmation] =
        useState(false);
    const [fetchDetailsKey, setFetchDetailsKey] = useState(
        DATA_DETAILS_QUERY_KEY
    );
    const [fetchDetailsQueryEnabled, setFetchDetailsQueryEnabled] =
        useState(false);
    const [defaultOutputFolder, setDefaultOutputFolder] = useState(null);
    const [defaultOutputFolderDetails, setDefaultOutputFolderDetails] =
        useState(null);
    const [requireAgaveAuth, setRequireAgaveAuth] = useState(true);
    const [outputFolderValidationError, setOutputFolderValidationError] =
        useState(null);
    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [webhookTopicsQueryEnabled, setWebHookTopicsQueryEnabled] =
        useState(false);
    const [webhookTypesQueryEnabled, setWebHookTypesQueryEnabled] =
        useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [fetchRedirectURIsQueryEnabled, setFetchRedirectURIsQueryEnabled] =
        useState(false);
    const [hpcAuthUrl, setHPCAuthUrl] = useState("");
    const [webhookTopics, setWebhookTopics] = useState();
    const [webhookTypes, setWebhookTypes] = useState();

    const classes = useStyles();

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    //get from cache if not fetch now.
    const prefCache = queryClient.getQueryData(BOOTSTRAP_KEY);
    const webhookTypesCache = queryClient.getQueryData(
        WEBHOOKS_TYPES_QUERY_KEY
    );
    const webhookTopicsCache = queryClient.getQueryData(
        WEBHOOKS_TOPICS_QUERY_KEY
    );

    const preProcessData = useCallback(
        (respData) => {
            let pref = respData.preferences;
            setDefaultOutputFolder(
                pref?.default_output_folder?.path ||
                    pref?.system_default_output_dir?.path
            );
            setBootstrapQueryEnabled(false);
            setBootstrapInfo(respData);
            const session = respData?.session;
            const agaveKey = session?.auth_redirect?.agave;
            if (agaveKey) {
                setRequireAgaveAuth(true);
            } else {
                setRequireAgaveAuth(false);
            }
        },
        [setBootstrapInfo]
    );

    useEffect(() => {
        if (prefCache && !defaultOutputFolder) {
            preProcessData(prefCache);
        } else {
            if (webhookTypes && webhookTopics) {
                setBootstrapQueryEnabled(true);
            }
        }
    }, [
        defaultOutputFolder,
        preProcessData,
        prefCache,
        webhookTopics,
        webhookTypes,
    ]);

    useEffect(() => {
        if (webhookTopicsCache) {
            setWebhookTopics(webhookTopicsCache?.topics);
        } else {
            setWebHookTopicsQueryEnabled(true);
        }

        if (webhookTypesCache) {
            setWebhookTypes(webhookTypesCache?.webhooktypes);
        } else {
            setWebHookTypesQueryEnabled(true);
        }
    }, [webhookTypesCache, webhookTopicsCache]);

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

    const { isFetching } = useBootStrap(
        bootstrapQueryEnabled,
        (respData) => preProcessData(respData),
        setBootstrapError
    );

    const { mutate: mutatePreferences, status: prefMutationStatus } =
        useSavePreferences(
            bootstrapInfo,
            setBootstrapInfo,
            (updatedPref) => {
                announce({
                    text: t("prefSaveSuccess"),
                    variant: SUCCESS,
                });
                queryClient.invalidateQueries(BOOTSTRAP_KEY);
            },
            (e) => {
                showErrorAnnouncer(t("savePrefError"), e);
            }
        );

    const { mutate: resetHPCToken, status: resetTokenStatus } = useMutation(
        resetToken,
        {
            onSuccess: () => {
                announce({
                    text: t("resetTokenSuccess"),
                    variant: SUCCESS,
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

        enabled: fetchRedirectURIsQueryEnabled,
        onSuccess: (resp) => {
            setFetchRedirectURIsQueryEnabled(false);
            const redirectUrl = resp[constants.AGAVE_SYSTEM_ID];
            if (redirectUrl) {
                setHPCAuthUrl(redirectUrl);
            }
        },
        onError: (e) => {
            showErrorAnnouncer(t("redirectError"), e);
        },
    });

    const { isFetching: isFetchingStat } = useQuery({
        queryKey: fetchDetailsKey,
        queryFn: () => getResourceDetails(fetchDetailsKey[1]),

        enabled: fetchDetailsQueryEnabled,
        onSuccess: (resp) => {
            const details = resp?.paths[defaultOutputFolder];
            if (!isWritable(details?.permission)) {
                setOutputFolderValidationError(
                    t("permissionSelectErrorMessage")
                );
            } else {
                setDefaultOutputFolderDetails(details);
                setOutputFolderValidationError(null);
            }
        },

        onError: (e) => {
            setOutputFolderValidationError(t("permissionSelectErrorMessage"));
        },
    });

    const { isFetching: isFetchingHookTypes } = useQuery({
        queryKey: WEBHOOKS_TYPES_QUERY_KEY,
        queryFn: getWebhookTypes,
        enabled: webhookTypesQueryEnabled,
        onSuccess: (data) => setWebhookTypes(data?.webhooktypes),
        staleTime: Infinity,
        cacheTime: Infinity,
        onError: (e) => showErrorAnnouncer(t("hookTypesFetchError"), e),
    });

    const { isFetching: isFetchingHookTopics } = useQuery({
        queryKey: WEBHOOKS_TOPICS_QUERY_KEY,
        queryFn: getWebhookTopics,
        enabled: webhookTopicsQueryEnabled,
        onSuccess: (data) => setWebhookTopics(data?.topics),
        staleTime: Infinity,
        cacheTime: Infinity,
        onError: (e) => showErrorAnnouncer(t("hookTopicsFetchError"), e),
    });

    const handleSubmit = (values) => {
        //prevent dupe submission
        if (prefMutationStatus !== constants.LOADING) {
            if (outputFolderValidationError) {
                announce({
                    text: t("validationMessage"),
                });
            } else {
                const updatedPref = { ...values };
                updatedPref.default_output_folder = defaultOutputFolderDetails;
                delete updatedPref.webhook;

                let updatedWebhook;

                if (values?.webhook?.url) {
                    const hook = values.webhook;
                    const selTopics = webhookTopics
                        .map((topic) => {
                            if (hook[`${topic.topic}`]) {
                                return topic.topic;
                            }
                            return null;
                        })
                        .filter((topic) => topic !== null);
                    updatedWebhook = {
                        webhooks: [
                            {
                                url: hook?.url,
                                type: { type: hook?.type?.type },
                                topics: selTopics,
                            },
                        ],
                    };
                }
                mutatePreferences({
                    preferences: updatedPref,
                    webhooks: updatedWebhook,
                });
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
            bootstrapInfo.preferences.system_default_output_dir.path
        );
        setShowRestoreConfirmation(false);
    };

    const setDefaultFolder = (setFieldValue, newFolder) => {
        setFieldValue(prefConstants.keys.DEFAULT_OUTPUT_FOLDER, newFolder);
        setDefaultOutputFolder(newFolder);
    };

    if (isFetching && !bootstrapInfo) {
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
    /*     const validate = (values, props) => {
        let errors = {};
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
                    if (
                        kbMap.get(key1) &&
                        kbMap.get(key1) === kbMap.get(key2)
                    ) {
                        errors[key2] = t("duplicateShortcutError");
                    }
                }
            }
        }
        return errors;
    };
 */
    const mapPropsToValues = (bootstrap) => {
        const emptyPref = {
            rememberLastPath: false,
            notificationKBShortcut: "",
            dataKBShortcut: "",
            lastFolder: "",
            enableImportEmailNotification: false,
            enableWaitTimeMessage: false,
            showLegacyPrompt: false,
            defaultFileSelectorPath: "",
            closeKBShortcut: "",
            appsKBShortcut: "",
            system_default_output_dir: {
                path: "",
            },
            default_output_folder: {
                path: "",
            },
            analysisKBShortcut: "",
            saveSession: false,
            enableAnalysisEmailNotification: false,
            enableHPCPrompt: false,
            showTourPrompt: false,
            webhook: { url: "", type: { type: "" } },
        };
        if (bootstrap === null || bootstrap === undefined) {
            return emptyPref;
        }
        if (bootstrap?.preferences) {
            if (bootstrap?.apps_info?.webhooks[0]) {
                let hook = bootstrap?.apps_info?.webhooks[0];
                const selectedTopics = hook?.topics;
                const reducer = (acc, currVal) => ({
                    ...acc,
                    [currVal?.topic]: selectedTopics?.includes(currVal?.topic),
                });
                const topics = webhookTopics?.reduce(reducer, {});
                return {
                    ...bootstrap.preferences,
                    webhook: {
                        ...hook,
                        ...topics,
                    },
                };
            } else {
                return {
                    ...bootstrap.preferences,
                    webhook: { url: "", type: { type: "" } },
                };
            }
        } else {
            return emptyPref;
        }
    };
    const busy =
        prefMutationStatus === constants.LOADING ||
        resetTokenStatus === constants.LOADING ||
        isFetchingURIs ||
        isFetchingHookTopics ||
        isFetchingHookTypes;
    return (
        <>
            {busy && (
                <CircularProgress
                    id={buildID(baseId, ids.LOADING_PROGRESS)}
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
                <Formik
                    initialValues={mapPropsToValues(bootstrapInfo)}
                    onSubmit={handleSubmit}
                    enableReinitialize
                    /* validate={validate} */
                >
                    {(props) => (
                        <Form
                            aria-busy={busy}
                            aria-describedby={buildID(
                                baseId,
                                ids.LOADING_PROGRESS
                            )}
                        >
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        id={buildID(
                                            baseId,
                                            ids.RESTORE_DEFAULT_BUTTON
                                        )}
                                        className={classes.actionButton}
                                        color="primary"
                                        onClick={() =>
                                            setShowRestoreConfirmation(true)
                                        }
                                        variant="outlined"
                                    >
                                        {t("restoreDefaultsBtnLbl")}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        id={buildID(
                                            baseId,
                                            ids.SAVE_PREFERENCES_BUTTON
                                        )}
                                        className={classes.actionButton}
                                        color="primary"
                                        type="submit"
                                        variant="contained"
                                    >
                                        {t("saveBtnLbl")}
                                    </Button>
                                </Grid>
                            </Grid>
                            <General
                                baseId={buildID(baseId, ids.GENERAL)}
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
                            <Webhooks
                                baseId={buildID(baseId, ids.WEBHOOK_PREF)}
                                webhookTopics={webhookTopics}
                                webhookTypes={webhookTypes}
                                values={props.values}
                                setFieldTouched={props.setFieldTouched}
                            />
                            {/* <Divider className={classes.dividers} />
                            <Shortcuts
                                baseId={buildID(baseId, ids.KB_SHORTCUTS)}
                            /> */}
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        id={buildID(
                                            baseId,
                                            ids.RESTORE_DEFAULT_BUTTON
                                        )}
                                        className={classes.actionButton}
                                        color="primary"
                                        onClick={() =>
                                            setShowRestoreConfirmation(true)
                                        }
                                        variant="outlined"
                                    >
                                        {t("restoreDefaultsBtnLbl")}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        id={buildID(
                                            baseId,
                                            ids.SAVE_PREFERENCES_BUTTON
                                        )}
                                        className={classes.actionButton}
                                        color="primary"
                                        type="submit"
                                        variant="contained"
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
                                        id={buildID(baseId, ids.OK_BUTTON)}
                                        onClick={restoreDefaults(
                                            props.setFieldValue
                                        )}
                                        color="primary"
                                    >
                                        {t("okBtnLbl")}
                                    </Button>
                                    <Button
                                        id={buildID(baseId, ids.CANCEL_BUTTON)}
                                        onClick={() =>
                                            setShowRestoreConfirmation(false)
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
            </Container>
        </>
    );
}

export default withErrorAnnouncer(Preferences);
