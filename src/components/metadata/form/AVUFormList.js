/**
 * @author psarando
 */
import React, { Component, Fragment } from "react";

import { FastField, FieldArray, getIn } from "formik";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

import ids from "../ids";
import intlData from "./messages";
import styles from "../styles";

import MetadataList from "../listing";
import SlideUpTransition from "../SlideUpTransition";

import {
    build,
    formatMessage,
    FormTextField,
    getFormError,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import ArrowBack from "@material-ui/icons/ArrowBack";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class EditAVU extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editingAttrIndex: -1,
        };
    }

    static propTypes = {
        targetName: PropTypes.string,
        closeAttrDialog: PropTypes.func.isRequired,
        avu: PropTypes.shape({
            attr: PropTypes.string.isRequired,
        }).isRequired,
    };

    render() {
        const {
            classes,
            intl,
            field,
            touched,
            errors,
            avu,
            open,
            editable,
            targetName,
        } = this.props;
        const { attr, avus } = avu;
        const { editingAttrIndex } = this.state;

        const avuErrors = getFormError(field, touched, errors);
        const error = avuErrors && avuErrors.error;

        const formID = build(ids.EDIT_METADATA_FORM, field, ids.DIALOG);
        const dialogTitleID = build(formID, ids.TITLE);

        const title = getMessage(
            editable
                ? "dialogTitleEditMetadataFor"
                : "dialogTitleViewMetadataFor",
            { values: { targetName } }
        );

        const hasChildren = avus && avus.length > 0;

        return (
            <Dialog
                open={open}
                onClose={this.props.closeAttrDialog}
                fullWidth={true}
                maxWidth="md"
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby={dialogTitleID}
                TransitionComponent={SlideUpTransition}
            >
                <AppBar className={classes.appBar}>
                    <Tooltip
                        title={error ? getMessage("errAVUEditFormTooltip") : ""}
                        placement="bottom-start"
                        enterDelay={200}
                    >
                        <Toolbar>
                            <IconButton
                                id={build(formID, ids.BUTTONS.CLOSE)}
                                color="inherit"
                                aria-label={formatMessage(intl, "close")}
                                disabled={!!error}
                                onClick={this.props.closeAttrDialog}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography
                                id={dialogTitleID}
                                variant="h6"
                                color="inherit"
                                className={classes.flex}
                            >
                                {title}
                            </Typography>
                        </Toolbar>
                    </Tooltip>
                </AppBar>
                <DialogContent>
                    <FastField
                        name={`${field}.attr`}
                        label={getMessage("attribute")}
                        id={build(formID, ids.AVU_ATTR)}
                        required={editable}
                        autoFocus={editable}
                        InputProps={{ readOnly: !editable }}
                        component={FormTextField}
                    />
                    <FastField
                        name={`${field}.value`}
                        label={getMessage("value")}
                        id={build(formID, ids.AVU_VALUE)}
                        InputProps={{ readOnly: !editable }}
                        component={FormTextField}
                    />
                    <FastField
                        name={`${field}.unit`}
                        label={getMessage("metadataUnitLabel")}
                        id={build(formID, ids.AVU_UNIT)}
                        InputProps={{ readOnly: !editable }}
                        component={FormTextField}
                    />

                    {(editable || hasChildren) && (
                        <Fragment>
                            <Divider />

                            <ExpansionPanel defaultExpanded={hasChildren}>
                                <ExpansionPanelSummary
                                    expandIcon={
                                        <ExpandMoreIcon
                                            id={build(
                                                formID,
                                                ids.BUTTONS.EXPAND,
                                                ids.AVU_GRID
                                            )}
                                        />
                                    }
                                >
                                    <Typography variant="subtitle1">
                                        {getMessage("metadataChildrenLabel")}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails
                                    className={classes.childAVUsContainer}
                                >
                                    <FieldArray
                                        name={`${field}.avus`}
                                        render={(arrayHelpers) => (
                                            <MetadataList
                                                {...arrayHelpers}
                                                editable={editable}
                                                parentID={formID}
                                                onEditAVU={(index) =>
                                                    this.setState({
                                                        editingAttrIndex: index,
                                                    })
                                                }
                                            />
                                        )}
                                    />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <FieldArray
                                name={`${field}.avus`}
                                render={(arrayHelpers) => (
                                    <FormDialogEditAVU
                                        {...arrayHelpers}
                                        editingAttrIndex={editingAttrIndex}
                                        editable={editable}
                                        targetName={attr}
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
                </DialogContent>
            </Dialog>
        );
    }
}

EditAVU = withStyles(styles)(withI18N(injectIntl(EditAVU), intlData));

const FormDialogEditAVU = ({
    editingAttrIndex,
    editable,
    targetName,
    closeAttrDialog,
    name,
    form: { touched, errors, values },
}) => {
    const avus = getIn(values, name);

    return (
        <Fragment>
            {avus &&
                avus.map((avu, index) => {
                    const field = `${name}[${index}]`;

                    return (
                        <EditAVU
                            key={field}
                            field={field}
                            touched={touched}
                            errors={errors}
                            avu={avu}
                            open={editingAttrIndex === index}
                            editable={editable}
                            targetName={targetName}
                            closeAttrDialog={closeAttrDialog}
                        />
                    );
                })}
        </Fragment>
    );
};

export default FormDialogEditAVU;
