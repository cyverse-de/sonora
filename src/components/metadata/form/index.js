/**
 * @author psarando
 */
import React, { Component, Fragment } from "react";

import { FieldArray, withFormik } from "formik";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

import ids from "../ids";
import intlData from "./messages";
import styles from "../styles";

import FormDialogEditAVU from "./AVUFormList";
import MetadataList from "../listing";
import SlideUpTransition from "../SlideUpTransition";

import {
    build,
    DEConfirmationDialog,
    formatHTMLMessage,
    formatMessage,
    getMessage,
    LoadingMask,
    withI18N,
} from "@cyverse-de/ui-lib";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@material-ui/icons/Help";
import ContentView from "@material-ui/icons/List";
import SaveIcon from "@material-ui/icons/Save";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

const ConfirmationDialog = withI18N(DEConfirmationDialog, intlData);

class EditMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDiscardChangesDialog: false,
            showImportConfirmationDialog: false,
            editingAttrIndex: -1,
            tabIndex: 0,
            irodsAVUsSelected: [],
            helpTextAnchor: null,
        };

        [
            "closeMetadataDialog",
            "confirmCloseMetadataDialog",
            "closeDiscardChangesDialog",
            "handleTabChange",
            "handleSelectAVU",
            "handleSelectAllAVUs",
            "onConfirmImportIRODSMetadata",
        ].forEach(
            (methodName) => (this[methodName] = this[methodName].bind(this))
        );
    }

    static propTypes = {
        targetResource: PropTypes.shape({ label: PropTypes.string }),
        presenter: PropTypes.shape({
            setDiskResourceMetadata: PropTypes.func.isRequired,
            closeMetadataDialog: PropTypes.func.isRequired,
            onSelectTemplateBtnSelected: PropTypes.func.isRequired,
            onSaveMetadataToFileBtnSelected: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.targetResource !== this.props.targetResource) {
            // The presenter wants to load metadata for a different target,
            // usually after already closing this dialog,
            // so reset the view to default settings.
            this.setState({
                tabIndex: 0,
                irodsAVUsSelected: [],
            });

            this.props.resetForm();
        } else if (prevProps.metadata !== this.props.metadata) {
            // The presenter wants to load metadata for the same target,
            // usually from a metadata template,
            // so reset the view to default settings.
            this.setState({
                tabIndex: 0,
                irodsAVUsSelected: [],
            });

            this.props.setValues(this.props.metadata);
        }
    }

    closeMetadataDialog() {
        const { dirty, editable, presenter } = this.props;

        dirty && editable
            ? this.setState({ showDiscardChangesDialog: true })
            : presenter.closeMetadataDialog();
    }

    confirmCloseMetadataDialog() {
        this.closeDiscardChangesDialog();
        this.props.presenter.closeMetadataDialog();
    }

    closeDiscardChangesDialog() {
        this.setState({ showDiscardChangesDialog: false });
    }

    handleTabChange(event, tabIndex) {
        this.setState({ tabIndex });
    }

    handleSelectAVU(avu, selected) {
        const { irodsAVUsSelected } = this.state;

        const newSelection = selected
            ? [...irodsAVUsSelected, avu]
            : irodsAVUsSelected.filter((selectedAVU) => selectedAVU !== avu);

        this.setState({ irodsAVUsSelected: newSelection });
    }

    handleSelectAllAVUs() {
        const {
            values: { "irods-avus": irodsAVUs },
        } = this.props;
        const { irodsAVUsSelected } = this.state;

        if (irodsAVUsSelected.length === 0) {
            this.setState({ irodsAVUsSelected: irodsAVUs });
        } else {
            this.setState({ irodsAVUsSelected: [] });
        }
    }

    onConfirmImportIRODSMetadata() {
        const { irodsAVUsSelected } = this.state;
        const {
            setFieldValue,
            values: { avus, "irods-avus": irodsAVUs },
        } = this.props;

        const irodsAVUsRemaining = new Set(irodsAVUs);

        irodsAVUsSelected.forEach((selectedAVU) =>
            irodsAVUsRemaining.delete(selectedAVU)
        );

        setFieldValue("avus", [...irodsAVUsSelected, ...avus]);
        setFieldValue("irods-avus", [...irodsAVUsRemaining]);

        this.setState({
            showImportConfirmationDialog: false,
            tabIndex: 0,
            irodsAVUsSelected: [],
        });
    }

    render() {
        const {
            classes,
            intl,
            open,
            editable,
            loading,
            targetResource: { label: targetName },
            // from formik
            handleSubmit,
            dirty,
            isSubmitting,
            errors,
            values,
        } = this.props;

        const {
            showDiscardChangesDialog,
            showImportConfirmationDialog,
            editingAttrIndex,
            tabIndex,
            irodsAVUsSelected,
            helpTextAnchor,
        } = this.state;

        const irodsAVUs = values["irods-avus"];
        const dialogTitleID = build(ids.EDIT_METADATA_FORM, ids.TITLE);

        return (
            <Dialog
                id={ids.EDIT_METADATA_FORM}
                open={open}
                fullWidth={true}
                maxWidth="md"
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby={dialogTitleID}
                TransitionComponent={SlideUpTransition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography
                            id={dialogTitleID}
                            variant="h6"
                            color="inherit"
                            className={classes.flex}
                        >
                            {getMessage(
                                editable
                                    ? "dialogTitleEditMetadataFor"
                                    : "dialogTitleViewMetadataFor",
                                { values: { targetName } }
                            )}
                        </Typography>

                        {tabIndex === 0 && (
                            <Tooltip
                                title={getMessage("viewInTemplate")}
                                placement="bottom"
                                enterDelay={200}
                            >
                                <span>
                                    <IconButton
                                        id={build(
                                            ids.EDIT_METADATA_FORM,
                                            ids.BUTTONS.VIEW_TEMPLATES
                                        )}
                                        aria-label={formatMessage(
                                            intl,
                                            "viewInTemplate"
                                        )}
                                        disabled={
                                            loading ||
                                            isSubmitting ||
                                            (errors.error && editable)
                                        }
                                        onClick={() =>
                                            this.props.presenter.onSelectTemplateBtnSelected(
                                                values
                                            )
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
                                title={getMessage("importIRODSMetadataTooltip")}
                                placement="bottom"
                                enterDelay={200}
                            >
                                <span>
                                    <IconButton
                                        id={build(
                                            ids.EDIT_METADATA_FORM,
                                            ids.BUTTONS.IMPORT_IRODS_METADATA
                                        )}
                                        aria-label={formatMessage(
                                            intl,
                                            "importIRODSMetadata"
                                        )}
                                        disabled={
                                            loading ||
                                            isSubmitting ||
                                            irodsAVUsSelected.length < 1
                                        }
                                        onClick={() =>
                                            this.setState({
                                                showImportConfirmationDialog: true,
                                            })
                                        }
                                        color="inherit"
                                    >
                                        <SaveAltIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}

                        <Tooltip
                            title={getMessage("saveToFile")}
                            placement="bottom-start"
                            enterDelay={200}
                        >
                            <span>
                                <IconButton
                                    id={build(
                                        ids.EDIT_METADATA_FORM,
                                        ids.BUTTONS.SAVE_METADATA_TO_FILE
                                    )}
                                    aria-label={formatMessage(
                                        intl,
                                        "saveToFile"
                                    )}
                                    disabled={
                                        loading ||
                                        (dirty && editable) ||
                                        isSubmitting
                                    }
                                    onClick={() =>
                                        this.props.presenter.onSaveMetadataToFileBtnSelected()
                                    }
                                    color="inherit"
                                >
                                    <SaveIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <IconButton
                            id={build(ids.EDIT_METADATA_FORM, ids.BUTTONS.HELP)}
                            aria-label={formatMessage(intl, "helpBtnLabel")}
                            onClick={(e) =>
                                this.setState({
                                    helpTextAnchor: e.currentTarget,
                                })
                            }
                            color="inherit"
                        >
                            <HelpIcon />
                        </IconButton>

                        <Popover
                            open={!!helpTextAnchor}
                            anchorEl={helpTextAnchor}
                            onClose={() =>
                                this.setState({ helpTextAnchor: null })
                            }
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                        >
                            <Typography className={classes.helpText}>
                                {formatHTMLMessage("helpText")}
                            </Typography>
                        </Popover>

                        <IconButton
                            id={build(
                                ids.EDIT_METADATA_FORM,
                                ids.BUTTONS.CLOSE_ICON
                            )}
                            onClick={this.closeMetadataDialog}
                            aria-label={formatMessage(intl, "close")}
                            color="inherit"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <LoadingMask loading={loading}>
                        {irodsAVUs && !!irodsAVUs.length && (
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={tabIndex}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                >
                                    <Tab label={getMessage("userMetadata")} />
                                    <Tab
                                        label={getMessage("additionalMetadata")}
                                    />
                                </Tabs>
                            </AppBar>
                        )}

                        {tabIndex === 0 && (
                            <Fragment>
                                <FieldArray
                                    name="avus"
                                    render={(arrayHelpers) => (
                                        <MetadataList
                                            {...arrayHelpers}
                                            field="avus"
                                            editable={editable}
                                            parentID={ids.EDIT_METADATA_FORM}
                                            onEditAVU={(index) =>
                                                this.setState({
                                                    editingAttrIndex: index,
                                                })
                                            }
                                        />
                                    )}
                                />

                                <FieldArray
                                    name="avus"
                                    render={(arrayHelpers) => (
                                        <FormDialogEditAVU
                                            {...arrayHelpers}
                                            editable={editable}
                                            targetName={targetName}
                                            editingAttrIndex={editingAttrIndex}
                                            closeAttrDialog={() =>
                                                this.setState({
                                                    editingAttrIndex: -1,
                                                })
                                            }
                                        />
                                    )}
                                />
                            </Fragment>
                        )}

                        {tabIndex === 1 && (
                            <Fragment>
                                <FieldArray
                                    name="irods-avus"
                                    render={(arrayHelpers) => (
                                        <MetadataList
                                            {...arrayHelpers}
                                            field="irods-avus"
                                            editable={false}
                                            parentID={ids.EDIT_METADATA_FORM}
                                            onEditAVU={(index) =>
                                                this.setState({
                                                    editingAttrIndex: index,
                                                })
                                            }
                                            selectable={editable}
                                            onSelectAVU={this.handleSelectAVU}
                                            onSelectAllClick={
                                                this.handleSelectAllAVUs
                                            }
                                            avusSelected={irodsAVUsSelected}
                                            rowsInPage={irodsAVUs.length}
                                        />
                                    )}
                                />
                                <FieldArray
                                    name="irods-avus"
                                    render={(arrayHelpers) => (
                                        <FormDialogEditAVU
                                            {...arrayHelpers}
                                            editable={false}
                                            targetName={targetName}
                                            editingAttrIndex={editingAttrIndex}
                                            closeAttrDialog={() =>
                                                this.setState({
                                                    editingAttrIndex: -1,
                                                })
                                            }
                                        />
                                    )}
                                />
                            </Fragment>
                        )}
                    </LoadingMask>
                </DialogContent>

                <DialogActions>
                    <Button
                        id={build(ids.EDIT_METADATA_FORM, ids.BUTTONS.CLOSE)}
                        onClick={this.closeMetadataDialog}
                        color="primary"
                    >
                        {getMessage("close")}
                    </Button>
                    {editable && (
                        <Button
                            id={build(ids.EDIT_METADATA_FORM, ids.BUTTONS.SAVE)}
                            disabled={
                                loading ||
                                !dirty ||
                                isSubmitting ||
                                errors.error
                            }
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                        >
                            {getMessage("save")}
                        </Button>
                    )}
                </DialogActions>

                <ConfirmationDialog
                    dialogOpen={showDiscardChangesDialog}
                    debugId={ids.EDIT_METADATA_FORM}
                    heading={getMessage("confirmDiscardChangesDialogHeader")}
                    message={getMessage("confirmDiscardChangesDialogMsg")}
                    onOkBtnClick={this.confirmCloseMetadataDialog}
                    onCancelBtnClick={this.closeDiscardChangesDialog}
                />

                <ConfirmationDialog
                    dialogOpen={showImportConfirmationDialog}
                    debugId={ids.EDIT_METADATA_FORM}
                    heading={getMessage("importIRODSMetadata")}
                    message={formatHTMLMessage("importIRODSMetadataMsg")}
                    onOkBtnClick={this.onConfirmImportIRODSMetadata}
                    onCancelBtnClick={() =>
                        this.setState({ showImportConfirmationDialog: false })
                    }
                />
            </Dialog>
        );
    }
}

const validateAVUs = (avus) => {
    const avusArrayErrors = [];

    avus.forEach((avu, index) => {
        const avuErrors = {};

        if (!avu.attr) {
            avuErrors.error = true;
            avuErrors.attr = getMessage("required");
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

    if (values.avus && values.avus.length > 0) {
        const avusArrayErrors = validateAVUs(values.avus);
        if (avusArrayErrors.length > 0) {
            errors.error = true;
            errors.avus = avusArrayErrors;
        }
    }

    return errors;
};

const handleSubmit = (
    { avus, "irods-avus": irodsAVUs },
    { props, setSubmitting, setStatus }
) => {
    const resolve = (metadata) => {
        setSubmitting(false);
        setStatus({ success: true, metadata });
    };
    const errorCallback = (httpStatusCode, errorMessage) => {
        setSubmitting(false);
        setStatus({ success: false, errorMessage });
    };

    const metadata = { ...props.metadata, avus, "irods-avus": irodsAVUs };

    props.presenter.setDiskResourceMetadata(metadata, resolve, errorCallback);
};

export default withFormik({
    mapPropsToValues: ({ metadata }) => ({ ...metadata }),
    validate,
    handleSubmit,
})(withStyles(styles)(withI18N(injectIntl(EditMetadata), intlData)));
