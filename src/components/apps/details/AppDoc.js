/**
 *  @author sriram, psarando
 *
 **/

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

import { useUserProfile } from "contexts/userProfile";
import {
    APP_DOC_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    getAppDoc,
    getAppDetails,
    saveAppDoc,
} from "serviceFacades/apps";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import GridLoading from "components/utils/GridLoading";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import markdownToHtml from "components/utils/markdownToHtml";

import {
    CircularProgress,
    Dialog,
    Divider,
    DialogTitle,
    DialogContent,
    Fab,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";

export const EDIT_MODE = "edit";
export const VIEW_MODE = "view";

function References(props) {
    const { references } = props;
    const { t } = useTranslation("apps");
    if (references) {
        return (
            <React.Fragment>
                <Typography variant="subtitle2">{t("references")}</Typography>
                {references.map((ref) => {
                    return <Typography key={ref}>{ref}</Typography>;
                })}
            </React.Fragment>
        );
    }
    return null;
}

function Documentation(props) {
    const {
        appId,
        versionId,
        systemId,
        app,
        appLoading,
        appError,
        setDirty,
        baseId,
    } = props;

    const [htmlDocumentation, setHtmlDocumentation] = useState("");
    const [userProfile] = useUserProfile();
    const [documentation, setDocumentation] = useState(null);
    const [references, setReferences] = useState(null);
    const [error, setError] = useState();
    const [saveError, setSaveError] = useState();
    const [editable, setAllowEditing] = useState(false);
    const [mode, setMode] = useState(VIEW_MODE);

    const { t } = useTranslation("apps");

    const isViewMode = mode === VIEW_MODE;
    const isEditMode = mode === EDIT_MODE;

    useEffect(() => {
        markdownToHtml(documentation).then((html) => {
            setHtmlDocumentation(html);
        });
    }, [documentation]);

    const { isFetching: docLoading } = useQuery({
        queryKey: [
            APP_DOC_QUERY_KEY,
            {
                systemId,
                appId,
                versionId,
            },
        ],
        queryFn: () =>
            getAppDoc({
                systemId,
                appId,
                versionId,
            }),

        enabled: !!appId && !!systemId,
        onSuccess: (doc) => {
            setDocumentation(doc.documentation);
            setReferences(doc.references);
            setError(false);
        },
        onError: setError,
    });

    const { mutate: mutateDoc, isLoading: docSaving } = useMutation(
        saveAppDoc,
        {
            onSuccess: () => {
                setDirty(false);
                setMode(VIEW_MODE);
                setSaveError(null);
            },
            onError: setSaveError,
        }
    );

    useEffect(() => {
        setAllowEditing(
            userProfile?.attributes?.email === app?.integrator_email
        );
    }, [app, userProfile]);

    if (docLoading || appLoading) {
        return <GridLoading rows={5} baseId={baseId} />;
    }

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("docFetchError")}
                errorObject={error}
            />
        );
    }

    return (
        <>
            {docSaving && (
                <CircularProgress
                    size={30}
                    thickness={5}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            {appError && (
                <ErrorTypographyWithDialog
                    errorMessage={t("appDetailsError")}
                    errorObject={appError}
                />
            )}
            {saveError && (
                <ErrorTypographyWithDialog
                    errorMessage={t("docSaveError")}
                    errorObject={saveError}
                />
            )}

            {!documentation && <Typography>{t("noDoc")}</Typography>}

            {isViewMode && documentation && (
                <div
                    id={buildID(baseId, ids.DOC_MARKDOWN)}
                    dangerouslySetInnerHTML={{
                        __html: htmlDocumentation,
                    }}
                />
            )}
            {isViewMode && references && references.length > 0 && (
                <>
                    <Divider />
                    <References references={references} />
                </>
            )}
            {isEditMode && documentation && (
                <TextField
                    id={buildID(baseId, ids.DOC_TEXT)}
                    multiline={true}
                    rows={20}
                    value={documentation}
                    fullWidth={true}
                    onChange={(event) => {
                        setDocumentation(event.target.value);
                        setDirty(true);
                    }}
                />
            )}
            {editable && isViewMode && documentation && (
                <Tooltip title={t("edit")}>
                    <Fab
                        id={buildID(baseId, ids.EDIT_BTN)}
                        color="primary"
                        aria-label={t("edit")}
                        style={{ float: "right" }}
                        size="medium"
                        onClick={() => setMode(EDIT_MODE)}
                    >
                        <EditIcon />
                    </Fab>
                </Tooltip>
            )}
            {editable && isEditMode && documentation && (
                <Tooltip title={t("save")}>
                    <Fab
                        id={buildID(baseId, ids.SAVE_BTN)}
                        color="primary"
                        aria-label={t("save")}
                        style={{ float: "right" }}
                        size="medium"
                        onClick={() =>
                            mutateDoc({
                                appId,
                                versionId,
                                systemId,
                                documentation,
                            })
                        }
                    >
                        <SaveIcon />
                    </Fab>
                </Tooltip>
            )}
        </>
    );
}

function AppDocDialog(props) {
    const { open, appId, versionId, systemId, onClose } = props;

    const [details, setDetails] = useState(null);
    const [detailsError, setDetailsError] = useState();
    const [dirty, setDirty] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const { t } = useTranslation("apps");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const docBaseId = ids.DOCUMENTATION_DLG;

    const handleClose = () => {
        if (dirty) {
            setOpenConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const { isFetching: detailsLoading } = useQuery({
        queryKey: [
            APP_DETAILS_QUERY_KEY,
            {
                systemId,
                appId,
                versionId,
            },
        ],
        queryFn: () =>
            getAppDetails({
                systemId,
                appId,
                versionId,
            }),
        enabled: !!appId && !!systemId,
        onSuccess: setDetails,
        onError: setDetailsError,
    });

    return (
        <>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        handleClose(event);
                    }
                }}
                id={docBaseId}
                fullScreen={isMobile}
            >
                <DialogTitle>
                    {t("documentation")}
                    <IconButton
                        id={buildID(docBaseId, ids.CLOSE_BTN)}
                        aria-label={t("close")}
                        onClick={handleClose}
                        style={{
                            position: "absolute",
                            right: theme.spacing(0.5),
                            top: theme.spacing(0.5),
                            margin: 0,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Divider />
                </DialogTitle>
                <DialogContent>
                    <Documentation
                        baseId={docBaseId}
                        appId={appId}
                        versionId={versionId}
                        systemId={systemId}
                        app={details}
                        appLoading={detailsLoading}
                        appError={detailsError}
                        setDirty={setDirty}
                    />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title={t("discardChanges")}
                contentText={t("docUnsavedPrompt")}
                onConfirm={() => {
                    setOpenConfirmDialog(false);
                    onClose();
                }}
            />
        </>
    );
}

export { Documentation };
export default AppDocDialog;
