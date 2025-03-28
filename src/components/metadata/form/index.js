/**
 * @author psarando
 */
import React from "react";

import { FieldArray, Formik } from "formik";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PropTypes from "prop-types";

import { Trans, useTranslation } from "i18n";

import constants from "../../../constants";

import ids from "../ids";

import AVUFormList from "./AVUFormList";
import MetadataFormToolbar from "./MetadataFormToolbar";
import MetadataList from "../listing";

import MetadataTemplateView from "../templates";
import MetadataTemplateListing from "../templates/Listing";

import SaveAsDialog from "components/data/SaveAsDialog";
import { getParentPath, isWritable } from "components/data/utils";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import SignInDialog from "components/utils/SignInDialog";
import ExternalLink from "components/utils/ExternalLink";
import CopyMetadataDialog from "components/metadata/CopyMetadataDialog";

import { ERROR_CODES, getErrorCode } from "components/error/errorCode";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import { useBootstrapInfo } from "contexts/bootstrap";
import { useUserProfile } from "contexts/userProfile";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import {
    FILESYSTEM_METADATA_QUERY_KEY,
    getFilesystemMetadata,
    saveFilesystemMetadata,
    setFilesystemMetadata,
} from "serviceFacades/metadata";

import { copyMetadata } from "serviceFacades/filesystem";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import { AppBar, Tab, Tabs } from "@mui/material";

const formatValues = ({ avus, "irods-avus": irodsAVUs }) => ({
    avus,
    "irods-avus": irodsAVUs,
});

const MetadataFormListing = (props) => {
    const {
        baseId,
        editable,
        loading,
        targetResource,
        onSelectTemplateBtnSelected,
        onSaveMetadataToFileBtnSelected,
        onCopyMetadataSelected,
        // from formik
        handleSubmit,
        resetForm,
        setFieldValue,
        dirty,
        isSubmitting,
        errors,
        values,
    } = props;

    const { avus, "irods-avus": irodsAVUs } = values;
    const targetName = targetResource?.label;

    const { t } = useTranslation("metadata");

    const [showImportConfirmationDialog, setShowImportConfirmationDialog] =
        React.useState(false);
    const [editingAttrIndex, setEditingAttrIndex] = React.useState(-1);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [irodsAVUsSelected, setIrodsAVUsSelected] = React.useState([]);

    React.useEffect(() => {
        // A different target will load new metadata,
        // so reset the view to default settings.
        setTabIndex(0);
        setIrodsAVUsSelected([]);

        resetForm();
    }, [resetForm, targetResource]);

    const dataId = targetResource?.id;

    const { isFetching, error: fetchError } = useQuery({
        queryKey: [FILESYSTEM_METADATA_QUERY_KEY, { dataId }],
        queryFn: () => getFilesystemMetadata({ dataId }),
        enabled: !!dataId,
        onSuccess: (metadata) => {
            trackIntercomEvent(IntercomEvents.VIEWED_METADATA, {
                path: targetResource?.path,
                id: targetResource?.id,
            });
            setTabIndex(0);
            setIrodsAVUsSelected([]);

            resetForm({ values: formatValues(metadata) });
        },
    });

    const handleTabChange = (event, index) => {
        setTabIndex(index);
    };

    const handleSelectAVU = (avu, selected) => {
        const newSelection = selected
            ? [...irodsAVUsSelected, avu]
            : irodsAVUsSelected.filter((selectedAVU) => selectedAVU !== avu);

        setIrodsAVUsSelected(newSelection);
    };

    const handleSelectAllAVUs = () => {
        if (irodsAVUsSelected.length === 0) {
            setIrodsAVUsSelected(irodsAVUs);
        } else {
            setIrodsAVUsSelected([]);
        }
    };

    const onConfirmImportIRODSMetadata = () => {
        const irodsAVUsRemaining = new Set(irodsAVUs);

        irodsAVUsSelected.forEach((selectedAVU) =>
            irodsAVUsRemaining.delete(selectedAVU)
        );

        setFieldValue("avus", [...irodsAVUsSelected, ...avus]);
        setFieldValue("irods-avus", [...irodsAVUsRemaining]);

        setShowImportConfirmationDialog(false);
        setTabIndex(0);
        setIrodsAVUsSelected([]);
    };

    const loadingOrSubmitting = loading || isFetching || isSubmitting;

    const saveDisabled = loadingOrSubmitting || !dirty || errors.error;

    const showSaveToFile = !loadingOrSubmitting && !dirty;

    const showCopy = !loadingOrSubmitting && !dirty;

    const showViewInTemplate =
        tabIndex === 0 && !loadingOrSubmitting && !(errors.error && editable);

    const showImportIRODSMetadata =
        tabIndex === 1 &&
        !loadingOrSubmitting &&
        editable &&
        irodsAVUsSelected.length > 0;

    return (
        <>
            <MetadataFormToolbar
                baseId={baseId}
                title={t(
                    editable
                        ? "dialogTitleEditMetadataFor"
                        : "dialogTitleViewMetadataFor",
                    { targetName }
                )}
                showSave={editable}
                saveDisabled={saveDisabled}
                onSave={handleSubmit}
                showSaveToFile={showSaveToFile}
                showCopy={showCopy}
                onSaveToFile={onSaveMetadataToFileBtnSelected}
                onCopyMetadata={onCopyMetadataSelected}
                showViewInTemplate={showViewInTemplate}
                onViewInTemplate={() => onSelectTemplateBtnSelected(values)}
                showImportIRODSMetadata={showImportIRODSMetadata}
                onImportIRODSMetadata={() =>
                    setShowImportConfirmationDialog(true)
                }
                targetResource={targetResource}
                dirty={dirty}
            />

            {irodsAVUs?.length > 0 && (
                <AppBar position="static" color="default">
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab
                            id={buildID(baseId, ids.BUTTONS.VIEW_USER_METADATA)}
                            label={t("userMetadata")}
                        />
                        <Tab
                            id={buildID(
                                baseId,
                                ids.BUTTONS.VIEW_IRODS_METADATA
                            )}
                            label={t("additionalMetadata")}
                        />
                    </Tabs>
                </AppBar>
            )}

            {tabIndex === 0 && (
                <>
                    <FieldArray
                        name="avus"
                        render={(arrayHelpers) => (
                            <MetadataList
                                {...arrayHelpers}
                                field="avus"
                                loading={loading || isFetching}
                                editable={editable}
                                fetchError={fetchError}
                                parentID={baseId}
                                onEditAVU={(index) =>
                                    setEditingAttrIndex(index)
                                }
                            />
                        )}
                    />

                    <FieldArray
                        name="avus"
                        render={(arrayHelpers) => (
                            <AVUFormList
                                {...arrayHelpers}
                                editable={editable}
                                targetName={targetName}
                                editingAttrIndex={editingAttrIndex}
                                closeAttrDialog={() => setEditingAttrIndex(-1)}
                            />
                        )}
                    />
                </>
            )}

            {tabIndex === 1 && (
                <>
                    <FieldArray
                        name="irods-avus"
                        render={(arrayHelpers) => (
                            <MetadataList
                                {...arrayHelpers}
                                field="irods-avus"
                                loading={loading || isFetching}
                                editable={false}
                                parentID={baseId}
                                onEditAVU={(index) =>
                                    setEditingAttrIndex(index)
                                }
                                selectable={editable}
                                onSelectAVU={handleSelectAVU}
                                onSelectAllClick={handleSelectAllAVUs}
                                avusSelected={irodsAVUsSelected}
                                rowsInPage={irodsAVUs.length}
                            />
                        )}
                    />
                    <FieldArray
                        name="irods-avus"
                        render={(arrayHelpers) => (
                            <AVUFormList
                                {...arrayHelpers}
                                editable={false}
                                targetName={targetName}
                                editingAttrIndex={editingAttrIndex}
                                closeAttrDialog={() => setEditingAttrIndex(-1)}
                            />
                        )}
                    />
                </>
            )}

            <ConfirmationDialog
                open={showImportConfirmationDialog}
                baseId={baseId}
                title={t("importIRODSMetadata")}
                contentText={
                    <Trans
                        t={t}
                        i18nKey="importIRODSMetadataMsg"
                        components={{
                            irodsMetadataLink: (
                                <ExternalLink
                                    href={constants.IMPORT_IRODS_METADATA_LINK}
                                />
                            ),
                        }}
                    />
                }
                onConfirm={onConfirmImportIRODSMetadata}
                onClose={() => setShowImportConfirmationDialog(false)}
            />
        </>
    );
};

const MetadataForm = ({
    loading,
    loadingError,
    showErrorAnnouncer,
    ...props
}) => {
    // targetResource should be spread down into the dialog form below.
    const { targetResource } = props;

    const [userProfile] = useUserProfile();
    const [bootstrapInfo] = useBootstrapInfo();

    const queryClient = useQueryClient();

    const { t } = useTranslation(["metadata", "common", "data"]);

    const [templateMetadata, setTemplateMetadata] = React.useState({});
    const [templateId, setTemplateId] = React.useState(null);

    const [templateListingDialogOpen, setTemplateListingDialogOpen] =
        React.useState(false);
    const [templateViewOpen, setTemplateViewOpen] = React.useState(false);
    const [saveAsDialogOpen, setSaveAsDialogOpen] = React.useState(false);
    const [signInDialogOpen, setSignInDialogOpen] = React.useState(false);
    const [copyDialogOpen, setCopyDialogOpen] = React.useState(false);
    const [saveFileError, setSaveFileError] = React.useState(null);
    const [copyMetadataError, setCopyMetadataError] = React.useState(null);

    const { mutate: setDiskResourceMetadata } = useMutation(
        ({ metadata }) =>
            setFilesystemMetadata({ dataId: targetResource.id, metadata }),
        {
            onSuccess: (resp, { onSuccess }) => {
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
            },
        }
    );

    const { mutate: saveMetadataToFile, isLoading: fileSaveLoading } =
        useMutation(
            ({ dest, recursive }) =>
                saveFilesystemMetadata({
                    dataId: targetResource.id,
                    dest,
                    recursive,
                }),
            {
                onSuccess: () => {
                    setSaveAsDialogOpen(false);
                    announce({
                        text: t("metadataSaved"),
                        variant: SUCCESS,
                    });
                },
                onError: (error, { dest }) => {
                    const errMsg =
                        getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                            ? t("data:fileExists", {
                                  path: getParentPath(dest),
                              })
                            : t("data:fileSaveError");

                    setSaveFileError(errMsg);
                },
            }
        );

    const { mutate: doCopyMetadata, isLoading: copyLoading } = useMutation(
        copyMetadata,
        {
            onSuccess: () => {
                announce({
                    text: t("copySuccess"),
                    variant: SUCCESS,
                });
                setCopyDialogOpen(false);
                setCopyMetadataError(null);
            },
            onError: (err) => {
                setCopyMetadataError(err);
            },
        }
    );

    const validateAVUs = (avus) => {
        const avusArrayErrors = [];

        avus.forEach((avu, index) => {
            const avuErrors = {};

            if (!avu.attr) {
                avuErrors.error = true;
                avuErrors.attr = t("required");
                avusArrayErrors[index] = avuErrors;
            }

            if (avu.avus && avu.avus.length > 0) {
                const subAVUErros = validateAVUs(avu.avus);
                if (subAVUErros.length > 0) {
                    avuErrors.error = true;
                    avuErrors.avus = subAVUErros;
                    avusArrayErrors[index] = avuErrors;
                }
            }
        });

        return avusArrayErrors;
    };

    const validate = (values) => {
        const errors = {};

        if (values.avus?.length > 0) {
            const avusArrayErrors = validateAVUs(values.avus);
            if (avusArrayErrors.length > 0) {
                errors.error = true;
                errors.avus = avusArrayErrors;
            }
        }

        return errors;
    };

    const showSaveSuccess = () => {
        announce({
            text: t("metadataSaved"),
            variant: SUCCESS,
        });
    };
    const showSaveError = (errorMessage) => {
        showErrorAnnouncer(t("errSubmission"), errorMessage);
    };

    const handleSubmit = (values, actions) => {
        const { setSubmitting, setStatus } = actions;

        const onSuccess = () => {
            setSubmitting(false);
            setStatus({ success: true });

            // Reload metadata from the API after successful save.
            queryClient.invalidateQueries([
                FILESYSTEM_METADATA_QUERY_KEY,
                { dataId: targetResource?.id },
            ]);

            showSaveSuccess();
        };

        const onError = (errorMessage) => {
            showSaveError(errorMessage);

            setSubmitting(false);
            setStatus({ success: false, errorMessage });
        };

        setDiskResourceMetadata({
            metadata: formatValues(values),
            onSuccess,
            onError,
        });
    };

    const preferences = bootstrapInfo?.preferences;
    const saveMetadataDestFolder =
        (preferences?.rememberLastPath && preferences?.lastFolder) ||
        getParentPath(targetResource?.path);

    const baseId = ids.EDIT_METADATA_FORM;
    const writable = isWritable(targetResource?.permission);

    if (loadingError) {
        return (
            <WrappedErrorHandler baseId={baseId} errorObject={loadingError} />
        );
    }

    return (
        <>
            <Formik
                initialValues={{}}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <MetadataFormListing
                        baseId={baseId}
                        loading={loading}
                        editable={userProfile && writable}
                        onSaveMetadataToFileBtnSelected={() => {
                            if (userProfile) {
                                setSaveAsDialogOpen(true);
                            } else {
                                setSignInDialogOpen(true);
                            }
                        }}
                        onSelectTemplateBtnSelected={(metadata) => {
                            setTemplateMetadata(metadata);
                            setTemplateListingDialogOpen(true);
                        }}
                        onCopyMetadataSelected={() => {
                            if (userProfile) {
                                setCopyDialogOpen(true);
                            } else {
                                setSignInDialogOpen(true);
                            }
                        }}
                        {...props}
                        {...formikProps}
                    />
                )}
            </Formik>

            <MetadataTemplateListing
                baseId={baseId}
                open={templateListingDialogOpen}
                onClose={() => setTemplateListingDialogOpen(false)}
                onSelectTemplate={(templateId) => {
                    setTemplateId(templateId);
                    setTemplateListingDialogOpen(false);
                    setTemplateViewOpen(true);
                }}
            />

            <MetadataTemplateView
                open={templateViewOpen}
                writable={writable}
                updateMetadataFromTemplateView={(
                    updatedMetadata,
                    onSuccess,
                    onError
                ) =>
                    setDiskResourceMetadata({
                        metadata: formatValues(updatedMetadata),
                        onSuccess: () => {
                            // Reload metadata from the API after successful save.
                            queryClient.invalidateQueries([
                                FILESYSTEM_METADATA_QUERY_KEY,
                                { dataId: targetResource?.id },
                            ]);

                            showSaveSuccess();
                            setTemplateViewOpen(false);
                            onSuccess();
                        },
                        onError: (errorMessage) => {
                            showSaveError(errorMessage);
                            onError();
                        },
                    })
                }
                onClose={() => setTemplateViewOpen(false)}
                templateId={templateId}
                metadata={templateMetadata}
            />

            <SaveAsDialog
                path={saveMetadataDestFolder}
                open={saveAsDialogOpen}
                onClose={() => setSaveAsDialogOpen(false)}
                loading={fileSaveLoading}
                saveFileError={saveFileError}
                onSaveAs={(dest) => {
                    setSaveFileError(null);
                    saveMetadataToFile({
                        dest,
                        recursive: true,
                    });
                }}
            />

            <CopyMetadataDialog
                open={copyDialogOpen}
                resourceToCopyFrom={targetResource}
                doCopy={doCopyMetadata}
                copying={copyLoading}
                error={copyMetadataError}
                handleClose={() => {
                    setCopyMetadataError(null);
                    setCopyDialogOpen(false);
                }}
            />

            <SignInDialog
                baseId={baseId}
                open={signInDialogOpen}
                handleClose={() => setSignInDialogOpen(false)}
            />
        </>
    );
};

MetadataForm.propTypes = {
    targetResource: PropTypes.shape({
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        permission: PropTypes.string.isRequired,
    }),
};

export default withErrorAnnouncer(MetadataForm);
