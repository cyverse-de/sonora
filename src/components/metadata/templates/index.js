/**
 * @author psarando
 */
import React, { Component, Fragment } from "react";

import { FastField, FieldArray, withFormik } from "formik";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

import deConstants from "../constants";
import constants from "./constants";
import ids from "./ids";
import intlData from "./messages";
import styles from "./style";

import {
    build,
    DEAlertDialog,
    DEConfirmationDialog,
    formatCurrentDate,
    formatMessage,
    FormCheckboxStringValue,
    FormIntegerField,
    FormMultilineTextField,
    FormNumberField,
    FormSelectField,
    FormTextField,
    FormTimestampField,
    getFormError,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import AstroThesaurusSearchField from "./AstroThesaurusSearchField";
import OntologyLookupServiceSearchField from "./OntologyLookupServiceSearchField";
import SlideUpTransition from "./SlideUpTransition";

import { withStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import ContentAdd from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ContentRemove from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const AlertDialog = withI18N(DEAlertDialog, intlData);
const ConfirmationDialog = withI18N(DEConfirmationDialog, intlData);

const newAVU = (attrTemplate) => {
    const attr = attrTemplate.name,
        unit = "";

    let value;
    switch (attrTemplate.type) {
        case constants.ATTRIBUTE_TYPE.TIMESTAMP:
            value = formatCurrentDate();
            break;

        case constants.ATTRIBUTE_TYPE.ENUM:
            value =
                attrTemplate.values &&
                attrTemplate.values.find((enumVal) => enumVal.is_default);
            value = value ? value.value : "";
            break;

        default:
            value = "";
            break;
    }

    return {
        attr,
        value,
        unit,
    };
};

class MetadataTemplateAttributeView extends Component {
    constructor(props) {
        super(props);

        const { avus } = props;
        const expanded = {};

        // Set all attrs as expanded in the state,
        // even if there is no matching attribute name in the template
        // and no expansion panel will be rendered for that attr.
        avus && avus.forEach((avu) => (expanded[avu.attr] = true));

        this.state = { expanded };
    }

    onAttrExpandedChange(prevExpanded, attr, attrExpanded) {
        const expanded = { ...prevExpanded };
        expanded[attr] = attrExpanded;
        this.setState({ expanded });
    }

    onAddAVU(arrayHelpers, attribute) {
        const avu = newAVU(attribute);
        this.addSubAVUs(attribute, avu);

        arrayHelpers.push(avu);

        this.onAttrExpandedChange(this.state.expanded, attribute.name, true);
    }

    addSubAVUs(attribute, avu) {
        const requiredAttrs =
            attribute.attributes &&
            attribute.attributes.filter((subAttr) => subAttr.required);

        if (requiredAttrs && requiredAttrs.length > 0) {
            avu.avus = requiredAttrs.map((subAttr) => {
                const subAVU = newAVU(subAttr);

                this.addSubAVUs(subAttr, subAVU);

                return subAVU;
            });
        }
    }

    render() {
        const {
            classes,
            intl,
            field,
            touched,
            errors,
            attributes,
            avus,
            presenter,
            writable,
        } = this.props;
        const { expanded } = this.state;

        return (
            <FieldArray
                name={`${field}.avus`}
                render={(arrayHelpers) => {
                    return attributes.map((attribute) => {
                        const attrFieldId = build(
                            ids.METADATA_TEMPLATE_VIEW,
                            field,
                            attribute.name
                        );

                        let attrErrors = false;
                        let canRemove = !attribute.required,
                            FieldComponent,
                            fieldProps = {
                                label: attribute.name,
                                required: attribute.required && writable,
                                inputProps: { readOnly: !writable },
                            };

                        switch (attribute.type) {
                            case constants.ATTRIBUTE_TYPE.BOOLEAN:
                                FieldComponent = FormCheckboxStringValue;
                                fieldProps = {
                                    ...fieldProps,
                                    disabled: !writable,
                                };
                                break;
                            case constants.ATTRIBUTE_TYPE.NUMBER:
                                FieldComponent = FormNumberField;
                                break;
                            case constants.ATTRIBUTE_TYPE.INTEGER:
                                FieldComponent = FormIntegerField;
                                break;
                            case constants.ATTRIBUTE_TYPE.MULTILINE_TEXT:
                                FieldComponent = FormMultilineTextField;
                                break;
                            case constants.ATTRIBUTE_TYPE.TIMESTAMP:
                                FieldComponent = FormTimestampField;
                                break;

                            case constants.ATTRIBUTE_TYPE.ENUM:
                                FieldComponent = FormSelectField;
                                fieldProps = {
                                    ...fieldProps,
                                    children:
                                        attribute.values &&
                                        attribute.values.map(
                                            (enumVal, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={enumVal.value}
                                                >
                                                    {enumVal.value}
                                                </MenuItem>
                                            )
                                        ),
                                };
                                break;

                            case constants.ATTRIBUTE_TYPE.ONTOLOGY_TERM_UAT:
                                FieldComponent = AstroThesaurusSearchField;
                                fieldProps = {
                                    ...fieldProps,
                                    presenter,
                                    isDisabled: !writable,
                                };
                                break;

                            case constants.ATTRIBUTE_TYPE.ONTOLOGY_TERM_OLS:
                                FieldComponent = OntologyLookupServiceSearchField;
                                fieldProps = {
                                    ...fieldProps,
                                    presenter,
                                    attribute,
                                    isDisabled: !writable,
                                };
                                break;

                            case constants.ATTRIBUTE_TYPE.GROUPING:
                                FieldComponent = "span";
                                fieldProps = {};
                                break;

                            default:
                                FieldComponent = FormTextField;
                                break;
                        }

                        let avuFields =
                            avus &&
                            avus.map((avu, index) => {
                                if (avu.attr !== attribute.name) {
                                    return null;
                                }

                                const avuFieldName = `${field}.avus[${index}]`;
                                const avuError = getFormError(
                                    avuFieldName,
                                    touched,
                                    errors
                                );
                                attrErrors = attrErrors || avuError;

                                const rowID = build(
                                    ids.METADATA_TEMPLATE_VIEW,
                                    avuFieldName
                                );

                                const isGroupingAttr =
                                    attribute.type ===
                                    constants.ATTRIBUTE_TYPE.GROUPING;

                                const deleteBtn = canRemove && writable && (
                                    <IconButton
                                        id={build(rowID, ids.BUTTONS.DELETE)}
                                        aria-label={formatMessage(
                                            intl,
                                            "delete"
                                        )}
                                        classes={{ root: classes.deleteIcon }}
                                        onClick={() =>
                                            arrayHelpers.remove(index)
                                        }
                                    >
                                        <ContentRemove />
                                    </IconButton>
                                );

                                const childAVUs = attribute.attributes &&
                                    attribute.attributes.length > 0 && (
                                        <MetadataTemplateAttributeForm
                                            field={avuFieldName}
                                            errors={errors}
                                            touched={touched}
                                            presenter={this.props.presenter}
                                            attributes={attribute.attributes}
                                            avus={avu.avus}
                                            writable={writable}
                                        />
                                    );

                                const avuField = (
                                    <Fragment key={avuFieldName}>
                                        <Grid
                                            item
                                            container
                                            spacing={2}
                                            justify="flex-start"
                                            alignItems="center"
                                        >
                                            <Grid item xs>
                                                <FastField
                                                    id={rowID}
                                                    name={`${avuFieldName}.value`}
                                                    component={FieldComponent}
                                                    {...fieldProps}
                                                />
                                            </Grid>
                                            {!isGroupingAttr && (
                                                <Grid item xs={1}>
                                                    {deleteBtn}
                                                </Grid>
                                            )}
                                        </Grid>
                                        {childAVUs && (
                                            <Grid item>
                                                {isGroupingAttr ? (
                                                    <fieldset>
                                                        <legend
                                                            style={{
                                                                margin:
                                                                    "0 0 0 auto",
                                                            }}
                                                        >
                                                            {deleteBtn}
                                                        </legend>
                                                        {childAVUs}
                                                    </fieldset>
                                                ) : (
                                                    childAVUs
                                                )}
                                            </Grid>
                                        )}
                                    </Fragment>
                                );

                                canRemove = true;

                                return avuField;
                            });

                        const hasAVUs =
                            avuFields &&
                            avuFields.filter((avuField) => avuField).length > 0;

                        return (
                            (writable || hasAVUs) && (
                                <ExpansionPanel
                                    key={attribute.name}
                                    expanded={!!expanded[attribute.name]}
                                    onChange={(event, attrExpanded) =>
                                        this.onAttrExpandedChange(
                                            expanded,
                                            attribute.name,
                                            attrExpanded
                                        )
                                    }
                                >
                                    <ExpansionPanelSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                id={build(
                                                    attrFieldId,
                                                    ids.BUTTONS.EXPAND
                                                )}
                                            />
                                        }
                                    >
                                        {writable && (
                                            <IconButton
                                                id={build(
                                                    attrFieldId,
                                                    ids.BUTTONS.ADD
                                                )}
                                                color="primary"
                                                aria-label={formatMessage(
                                                    intl,
                                                    "addRow"
                                                )}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.onAddAVU(
                                                        arrayHelpers,
                                                        attribute
                                                    );
                                                }}
                                            >
                                                <ContentAdd />
                                            </IconButton>
                                        )}
                                        <div className={classes.title}>
                                            <Typography
                                                variant="h6"
                                                color="inherit"
                                            >
                                                {attribute.name}
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                className={
                                                    classes.errorSubTitle
                                                }
                                            >
                                                {attrErrors &&
                                                    attrErrors.error &&
                                                    getMessage(
                                                        "errAttrHasErrors"
                                                    )}
                                            </Typography>
                                        </div>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Grid
                                            container
                                            spacing={2}
                                            direction="column"
                                            justify="flex-start"
                                            alignItems="stretch"
                                        >
                                            <Grid item xs>
                                                <Typography variant="subtitle1">
                                                    {attribute.description}
                                                </Typography>
                                            </Grid>
                                            {avuFields}
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                        );
                    });
                }}
            />
        );
    }
}

const MetadataTemplateAttributeForm = withStyles(styles)(
    withI18N(injectIntl(MetadataTemplateAttributeView), intlData)
);

class MetadataTemplateView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationDialog: false,
            showErrorsDialog: false,
        };

        [
            "closeMetadataTemplateDialog",
            "confirmCloseMetadataTemplateDialog",
            "closeConfirmationDialog",
            "handleSubmit",
        ].forEach(
            (methodName) => (this[methodName] = this[methodName].bind(this))
        );
    }

    static propTypes = {
        presenter: PropTypes.shape({
            updateMetadataFromTemplateView: PropTypes.func.isRequired,
            closeMetadataTemplateDialog: PropTypes.func.isRequired,
        }),
    };

    handleSubmit() {
        const { handleSubmit, errors } = this.props;

        if (errors.error) {
            this.setState({ showErrorsDialog: true });
        } else {
            handleSubmit();
        }
    }

    closeMetadataTemplateDialog() {
        const { dirty, writable, presenter } = this.props;

        dirty && writable
            ? this.setState({ showConfirmationDialog: true })
            : presenter.closeMetadataTemplateDialog();
    }

    confirmCloseMetadataTemplateDialog() {
        this.closeConfirmationDialog();
        this.props.presenter.closeMetadataTemplateDialog();
    }

    closeConfirmationDialog() {
        this.setState({ showConfirmationDialog: false });
    }

    render() {
        const {
            classes,
            intl,
            open,
            writable,
            // from formik
            values,
            isSubmitting,
            errors,
            touched,
        } = this.props;

        const { showConfirmationDialog, showErrorsDialog } = this.state;

        const dialogTitleID = build(ids.METADATA_TEMPLATE_VIEW, ids.TITLE);

        return (
            <Dialog
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
                            {values.template.name}
                        </Typography>
                        <IconButton
                            id={build(
                                ids.METADATA_TEMPLATE_VIEW,
                                ids.BUTTONS.CLOSE_ICON
                            )}
                            aria-label={formatMessage(intl, "close")}
                            onClick={this.closeMetadataTemplateDialog}
                            color="inherit"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <MetadataTemplateAttributeForm
                        field="metadata"
                        errors={errors}
                        touched={touched}
                        presenter={this.props.presenter}
                        attributes={values.template.attributes}
                        avus={values.metadata.avus}
                        writable={writable}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        id={build(
                            ids.METADATA_TEMPLATE_VIEW,
                            ids.BUTTONS.CLOSE
                        )}
                        onClick={this.closeMetadataTemplateDialog}
                        color="primary"
                    >
                        {getMessage("close")}
                    </Button>
                    {writable && (
                        <Button
                            id={build(
                                ids.METADATA_TEMPLATE_VIEW,
                                ids.BUTTONS.SAVE
                            )}
                            disabled={isSubmitting}
                            onClick={this.handleSubmit}
                            color="primary"
                            variant="contained"
                        >
                            {getMessage("save")}
                        </Button>
                    )}
                </DialogActions>

                <AlertDialog
                    dialogOpen={showErrorsDialog}
                    heading={formatMessage(
                        intl,
                        "errMetadataTemplateAlertHeading"
                    )}
                    alertMessage={formatMessage(
                        intl,
                        "errMetadataTemplateAlertMsg"
                    )}
                    handleClose={() =>
                        this.setState({ showErrorsDialog: false })
                    }
                />

                <ConfirmationDialog
                    dialogOpen={showConfirmationDialog}
                    debugId={ids.METADATA_TEMPLATE_VIEW}
                    heading={getMessage("confirmDiscardChangesDialogHeader")}
                    message={getMessage("confirmDiscardChangesDialogMsg")}
                    onOkBtnClick={this.confirmCloseMetadataTemplateDialog}
                    onCancelBtnClick={this.closeConfirmationDialog}
                />
            </Dialog>
        );
    }
}

const mapPropsToValues = (props) => {
    const { template } = props;
    const metadata = { ...props.metadata };

    const attributeMap = {};
    const mapAttributesToAttrMap = (attrMap, attributes) =>
        attributes.forEach((attribute) => {
            const attrCopy = { ...attribute };
            attrMap[attribute.name] = attrCopy;

            if (attrCopy.attributes && attrCopy.attributes.length > 0) {
                const subAttrMap = {};
                mapAttributesToAttrMap(subAttrMap, attrCopy.attributes);
                attrCopy.attributes = subAttrMap;
            }
        });

    mapAttributesToAttrMap(attributeMap, template.attributes);

    const mapAttributesToAVUs = (attributes, propsAVUs) => {
        let avus = propsAVUs ? [...propsAVUs] : [];

        attributes
            .filter((attribute) => attribute.required)
            .forEach((attribute) => {
                if (
                    avus.filter((avu) => avu.attr === attribute.name).length < 1
                ) {
                    avus.push(newAVU(attribute));
                }

                const { attributes } = attribute;
                if (attributes && attributes.length > 0) {
                    avus = avus.map((propsAVU) => {
                        let avu = { ...propsAVU };

                        if (avu.attr === attribute.name) {
                            avu.avus = mapAttributesToAVUs(
                                attributes,
                                avu.avus
                            );
                        }

                        return avu;
                    });
                }
            });

        return avus;
    };

    metadata.avus = mapAttributesToAVUs(template.attributes, metadata.avus);

    return { template, attributeMap, metadata };
};

const validateAVUs = (avus, attributeMap) => {
    const avuArrayErrors = [];

    avus.forEach((avu, avuIndex) => {
        const avuErrors = {};
        const value = avu.value;

        const attrTemplate = attributeMap[avu.attr];
        if (!attrTemplate) {
            return;
        }

        if (attrTemplate.required && value === "") {
            avuErrors.value = getMessage("required");
            avuErrors.error = true;
            avuArrayErrors[avuIndex] = avuErrors;
        } else if (value) {
            switch (attrTemplate.type) {
                case constants.ATTRIBUTE_TYPE.NUMBER:
                case constants.ATTRIBUTE_TYPE.INTEGER:
                    let numVal = Number(value);
                    if (isNaN(numVal)) {
                        avuErrors.value = getMessage(
                            "templateValidationErrMsgNumber"
                        );
                        avuErrors.error = true;
                        avuArrayErrors[avuIndex] = avuErrors;
                    }

                    break;

                case constants.ATTRIBUTE_TYPE.TIMESTAMP:
                    if (!Date.parse(value)) {
                        avuErrors.value = getMessage(
                            "templateValidationErrMsgTimestamp"
                        );
                        avuErrors.error = true;
                        avuArrayErrors[avuIndex] = avuErrors;
                    }

                    break;

                case constants.ATTRIBUTE_TYPE.URL:
                    if (!deConstants.URL_REGEX.test(value)) {
                        avuErrors.value = getMessage(
                            "templateValidationErrMsgURL"
                        );
                        avuErrors.error = true;
                        avuArrayErrors[avuIndex] = avuErrors;
                    }

                    break;

                default:
                    break;
            }
        }

        if (attrTemplate.attributes && avu.avus && avu.avus.length > 0) {
            const subAttrErros = validateAVUs(
                avu.avus,
                attrTemplate.attributes
            );
            if (subAttrErros.length > 0) {
                avuErrors.avus = subAttrErros;
                avuErrors.error = true;
                avuArrayErrors[avuIndex] = avuErrors;
            }
        }
    });

    return avuArrayErrors;
};

const validate = (values) => {
    const errors = {};
    const { attributeMap, metadata } = values;

    if (metadata.avus && metadata.avus.length > 0) {
        const avuArrayErrors = validateAVUs(metadata.avus, attributeMap);
        if (avuArrayErrors.length > 0) {
            errors.metadata = { avus: avuArrayErrors };
            errors.error = true;
        }
    }

    return errors;
};

/**
 * Users do not fill in the values of Grouping attributes,
 * but duplicated attributes need unique values in order for the service to save them as separate AVUs.
 * This function will update AVUs that have attributes matching any Grouping types found in the template,
 * setting their values to a comma-separated list of their child AVUs' values.
 */
const postProcessAVUs = (avus, attributeMap) => {
    return avus.map((avu) => {
        const attrTemplate = attributeMap[avu.attr];

        const isNumberAttr =
            attrTemplate &&
            (attrTemplate.type === constants.ATTRIBUTE_TYPE.NUMBER ||
                attrTemplate.type === constants.ATTRIBUTE_TYPE.INTEGER);

        const isGroupingAttr =
            attrTemplate &&
            attrTemplate.type === constants.ATTRIBUTE_TYPE.GROUPING;

        const hasChildAVUs = avu.avus && avu.avus.length > 0;

        if (isNumberAttr && (avu.value || avu.value === 0)) {
            // The API will only accept AVU values as strings.
            avu.value = avu.value.toString();
        }

        if (attrTemplate && hasChildAVUs) {
            avu = {
                ...avu,
                avus: postProcessAVUs(avu.avus, attrTemplate.attributes),
            };

            if (isGroupingAttr) {
                avu.value = avu.avus.map((avu) => avu.value).join(", ");
            }
        }

        return avu;
    });
};

const handleSubmit = (
    { attributeMap, metadata },
    { props, setSubmitting, setStatus }
) => {
    const resolve = (metadata) => {
        setSubmitting(false);
        setStatus("submitted");
    };
    const errorCallback = (httpStatusCode, errorMessage) => {
        setSubmitting(false);
        setStatus("error");
    };

    props.presenter.updateMetadataFromTemplateView(
        { ...metadata, avus: postProcessAVUs(metadata.avus, attributeMap) },
        resolve,
        errorCallback
    );
};

export default withFormik({
    enableReinitialize: true,
    mapPropsToValues,
    validate,
    handleSubmit,
})(withStyles(styles)(withI18N(injectIntl(MetadataTemplateView), intlData)));
