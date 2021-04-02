/**
 *  @author sriram
 *
 **/

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";

import { useTranslation } from "i18n";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

import ids from "../ids";
import constants from "../../../constants";

import { useUserProfile } from "contexts/userProfile";
import {
    APP_DOC_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    getAppDoc,
    getAppDetails,
    saveAppDoc,
} from "serviceFacades/apps";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
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
        documentation,
        references,
        loading,
        error,
        editable,
        mode,
        setMode,
        onDocChange,
        onSave,
        baseId,
    } = props;

    const [htmlDocumentation, setHtmlDocumentation] = useState("");

    const { t } = useTranslation("apps");

    useEffect(() => {
        markdownToHtml(documentation).then((html) => {
            setHtmlDocumentation(html);
        });
    }, [documentation]);

    if (loading) {
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

    if (documentation) {
        const isViewMode = mode === VIEW_MODE;
        const isEditMode = mode === EDIT_MODE;
        return (
            <>
                {isViewMode && (
                    <div
                        id={buildDebugId(baseId, ids.DOC_MARKDOWN)}
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
                {isEditMode && (
                    <TextField
                        id={buildDebugId(baseId, ids.DOC_TEXT)}
                        multiline={true}
                        rows={20}
                        value={documentation}
                        fullWidth={true}
                        onChange={(event) => onDocChange(event.target.value)}
                    />
                )}
                {editable && isViewMode && (
                    <Tooltip title={t("edit")}>
                        <Fab
                            id={buildDebugId(baseId, ids.EDIT_BTN)}
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
                {editable && isEditMode && (
                    <Tooltip title={t("save")}>
                        <Fab
                            id={buildDebugId(baseId, ids.SAVE_BTN)}
                            color="primary"
                            aria-label={t("save")}
                            style={{ float: "right" }}
                            size="medium"
                            onClick={onSave}
                        >
                            <SaveIcon />
                        </Fab>
                    </Tooltip>
                )}
            </>
        );
    } else {
        return <Typography>{t("noDoc")}</Typography>;
    }
}

function AppDoc(props) {
    const { open, appId, systemId, onClose } = props;
    const [userProfile] = useUserProfile();
    const [documentation, setDocumentation] = useState(null);
    const [references, setReferences] = useState(null);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState();
    const [saveError, setSaveError] = useState();
    const [detailsError, setDetailsError] = useState();
    const [allowEditing, setAllowEditing] = useState(false);
    const [mode, setMode] = useState(VIEW_MODE);
    const [dirty, setDirty] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const { t } = useTranslation("apps");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const enabled = appId != null && systemId !== null;
    const docBaseId = ids.DOCUMENTATION_DLG;

    const handleClose = () => {
        if (dirty) {
            setOpenConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const { isFetching: docStatus } = useQuery({
        queryKey: [
            APP_DOC_QUERY_KEY,
            {
                systemId,
                appId,
            },
        ],
        queryFn: getAppDoc,
        config: {
            enabled,
            onSuccess: (doc) => {
                setDocumentation(doc.documentation);
                setReferences(doc.references);
                setError(false);
            },
            onError: setError,
        },
    });

    const { isFetching: detailsStatus } = useQuery({
        queryKey: [
            APP_DETAILS_QUERY_KEY,
            {
                systemId,
                appId,
            },
        ],
        queryFn: getAppDetails,
        config: {
            enabled,
            onSuccess: setDetails,
            onError: setDetailsError,
        },
    });

    const [mutateDoc, { status: docMutationStatus }] = useMutation(saveAppDoc, {
        onSuccess: () => {
            setDirty(false);
            setMode(VIEW_MODE);
            setSaveError(null);
        },
        onError: setSaveError,
    });

    useEffect(() => {
        if (userProfile?.attributes?.email === details?.integrator_email) {
            setAllowEditing(true);
        }
    }, [details, userProfile]);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                disableBackdropClick
                id={docBaseId}
                fullScreen={isMobile}
            >
                <DialogTitle>
                    {t("documentation")}
                    <IconButton
                        id={buildDebugId(docBaseId, ids.CLOSE_BTN)}
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
                    {docMutationStatus === constants.LOADING && (
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
                    {detailsError && (
                        <ErrorTypographyWithDialog
                            errorMessage={t("appDetailsError")}
                            errorObject={detailsError}
                        />
                    )}
                    {saveError && (
                        <ErrorTypographyWithDialog
                            errorMessage={t("docSaveError")}
                            errorObject={saveError}
                        />
                    )}
                    <Documentation
                        baseId={docBaseId}
                        loading={docStatus || detailsStatus}
                        documentation={documentation}
                        references={references}
                        error={error}
                        editable={allowEditing}
                        mode={mode}
                        setMode={setMode}
                        onDocChange={(updatedDoc) => {
                            setDocumentation(updatedDoc);
                            setDirty(true);
                        }}
                        onSave={() => {
                            mutateDoc({
                                appId,
                                systemId,
                                documentation,
                            });
                        }}
                    />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                title={t("documentation")}
                contentText={t("docSavePrompt")}
                onConfirm={() => {
                    mutateDoc({
                        appId,
                        systemId,
                        documentation,
                    });
                    setOpenConfirmDialog(false);
                }}
            />
        </>
    );
}

export default AppDoc;
