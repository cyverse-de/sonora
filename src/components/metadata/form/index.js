/**
 * @author psarando
 */
import React from "react";

import { FieldArray, Formik } from "formik";
import { Trans } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import constants from "../../../constants";

import ids from "../ids";
import styles from "../styles";

import AVUFormList from "./AVUFormList";
import MetadataList from "../listing";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import ExternalLink from "components/utils/ExternalLink";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    FILESYSTEM_METADATA_QUERY_KEY,
    getFilesystemMetadata,
    setFilesystemMetadata,
} from "serviceFacades/metadata";

import { AnnouncerConstants, announce, build } from "@cyverse-de/ui-lib";

import {
    AppBar,
    Button,
    IconButton,
    Popover,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    makeStyles,
} from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";
import ContentView from "@material-ui/icons/List";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

const useStyles = makeStyles(styles);

const MetadataFormListing = (props) => {
    const {
        editable,
        loading,
        fetchError,
        metadata,
        targetResource,
        onSelectTemplateBtnSelected,
        onSaveMetadataToFileBtnSelected,
        // from formik
        handleSubmit,
        resetForm,
        setValues,
        setFieldValue,
        dirty,
        isSubmitting,
        errors,
        values,
    } = props;

    const { avus, "irods-avus": irodsAVUs } = values;
    const targetName = targetResource?.label;

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    const [
        showImportConfirmationDialog,
        setShowImportConfirmationDialog,
    ] = React.useState(false);
    const [editingAttrIndex, setEditingAttrIndex] = React.useState(-1);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [irodsAVUsSelected, setIrodsAVUsSelected] = React.useState([]);
    const [helpTextAnchor, setHelpTextAnchor] = React.useState(null);

    React.useEffect(() => {
        // The presenter wants to load metadata for a different target,
        // usually after already closing this dialog,
        // so reset the view to default settings.
        setTabIndex(0);
        setIrodsAVUsSelected([]);

        resetForm();
    }, [resetForm, targetResource]);

    React.useEffect(() => {
        // The presenter wants to load new metadata,
        // possibly for the same target, and usually from a metadata template,
        // so reset the view to default settings.
        setTabIndex(0);
        setIrodsAVUsSelected([]);

        setValues(metadata);
    }, [setValues, metadata]);

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

    const dialogTitleID = build(ids.EDIT_METADATA_FORM, ids.TITLE);

    return (
        <>
            <Toolbar variant="dense">
                <Typography
                    id={dialogTitleID}
                    variant="h6"
                    color="inherit"
                    className={classes.flex}
                >
                    {t(
                        editable
                            ? "dialogTitleEditMetadataFor"
                            : "dialogTitleViewMetadataFor",
                        { targetName }
                    )}
                </Typography>

                {tabIndex === 0 && (
                    <Tooltip
                        title={t("viewInTemplate")}
                        placement="bottom"
                        enterDelay={200}
                    >
                        <span>
                            <IconButton
                                id={build(
                                    ids.EDIT_METADATA_FORM,
                                    ids.BUTTONS.VIEW_TEMPLATES
                                )}
                                aria-label={t("viewInTemplate")}
                                disabled={
                                    loading ||
                                    isSubmitting ||
                                    (errors.error && editable)
                                }
                                onClick={() =>
                                    onSelectTemplateBtnSelected(values)
                                }
                                color="inherit"
                            >
                                <ContentView />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}

                {tabIndex === 1 && editable && (
                    <Tooltip
                        title={t("importIRODSMetadataTooltip")}
                        placement="bottom"
                        enterDelay={200}
                    >
                        <span>
                            <IconButton
                                id={build(
                                    ids.EDIT_METADATA_FORM,
                                    ids.BUTTONS.IMPORT_IRODS_METADATA
                                )}
                                aria-label={t("importIRODSMetadata")}
                                disabled={
                                    loading ||
                                    isSubmitting ||
                                    irodsAVUsSelected.length < 1
                                }
                                onClick={() =>
                                    setShowImportConfirmationDialog(true)
                                }
                                color="inherit"
                            >
                                <SaveAltIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}

                <Tooltip
                    title={t("saveToFile")}
                    placement="bottom-start"
                    enterDelay={200}
                >
                    <span>
                        <IconButton
                            id={build(
                                ids.EDIT_METADATA_FORM,
                                ids.BUTTONS.SAVE_METADATA_TO_FILE
                            )}
                            aria-label={t("saveToFile")}
                            disabled={
                                loading || (dirty && editable) || isSubmitting
                            }
                            onClick={() => onSaveMetadataToFileBtnSelected()}
                            color="inherit"
                        >
                            <SaveIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <IconButton
                    id={build(ids.EDIT_METADATA_FORM, ids.BUTTONS.HELP)}
                    aria-label={t("helpBtnLabel")}
                    onClick={(e) => setHelpTextAnchor(e.currentTarget)}
                    color="inherit"
                >
                    <HelpIcon />
                </IconButton>

                <Popover
                    open={!!helpTextAnchor}
                    anchorEl={helpTextAnchor}
                    onClose={() => setHelpTextAnchor(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <Typography className={classes.helpText} component="div">
                        <Trans
                            t={t}
                            i18nKey="helpText"
                            components={{
                                p: <p />,
                            }}
                        />
                    </Typography>
                </Popover>

                {editable && (
                    <Button
                        id={build(ids.EDIT_METADATA_FORM, ids.BUTTONS.SAVE)}
                        disabled={
                            loading || !dirty || isSubmitting || errors.error
                        }
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                    >
                        {t("save")}
                    </Button>
                )}
            </Toolbar>

            {irodsAVUs && !!irodsAVUs.length && (
                <AppBar position="static" color="default">
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={t("userMetadata")} />
                        <Tab label={t("additionalMetadata")} />
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
                                loading={loading}
                                editable={editable}
                                fetchError={fetchError}
                                parentID={ids.EDIT_METADATA_FORM}
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
                                loading={loading}
                                editable={false}
                                parentID={ids.EDIT_METADATA_FORM}
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
                baseId={ids.EDIT_METADATA_FORM}
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

const MetadataForm = ({ loading, showErrorAnnouncer, ...props }) => {
    // targetResource should be spread down into the dialog form below.
    const { targetResource } = props;

    const { t } = useTranslation("metadata");

    const [metadata, setMetadata] = React.useState({});

    const [metadataListingKey, setMetadataListingKey] = React.useState(
        FILESYSTEM_METADATA_QUERY_KEY
    );
    const [
        fetchMetadataQueryEnabled,
        setFetchMetadataQueryEnabled,
    ] = React.useState(false);

    const { isFetching, error: fetchError } = useQuery({
        queryKey: metadataListingKey,
        queryFn: getFilesystemMetadata,
        config: {
            enabled: fetchMetadataQueryEnabled,
            onSuccess: setMetadata,
        },
    });

    const [setDiskResourceMetadata] = useMutation(
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

    React.useEffect(() => {
        const dataId = targetResource?.id;
        setMetadataListingKey([FILESYSTEM_METADATA_QUERY_KEY, { dataId }]);
        setFetchMetadataQueryEnabled(!!dataId);
    }, [targetResource]);

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

    const handleSubmit = (values, actions) => {
        const { avus, "irods-avus": irodsAVUs } = values;
        const { setSubmitting, setStatus } = actions;

        const updatedMetadata = { ...metadata, avus, "irods-avus": irodsAVUs };

        const onSuccess = () => {
            setSubmitting(false);
            setStatus({ success: true });
            setMetadata(updatedMetadata);

            announce({
                text: t("metadataSaved"),
                variant: AnnouncerConstants.SUCCESS,
            });
        };

        const onError = (errorMessage) => {
            showErrorAnnouncer(t("errSubmission"), errorMessage);

            setSubmitting(false);
            setStatus({ success: false, errorMessage });
        };

        setDiskResourceMetadata({
            metadata: updatedMetadata,
            onSuccess,
            onError,
        });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ ...metadata }}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {(formikProps) => (
                <MetadataFormListing
                    loading={loading || isFetching}
                    fetchError={fetchError}
                    metadata={metadata}
                    {...props}
                    {...formikProps}
                />
            )}
        </Formik>
    );
};

MetadataForm.propTypes = {
    targetResource: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
    }),
    onSelectTemplateBtnSelected: PropTypes.func.isRequired,
    onSaveMetadataToFileBtnSelected: PropTypes.func.isRequired,
};

export default withErrorAnnouncer(MetadataForm);
