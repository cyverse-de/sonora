/**
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray, getIn } from "formik";
import PropTypes from "prop-types";

import { useTranslation } from "i18n";

import DEDialog from "components/utils/DEDialog";

import ids from "../ids";
import styles from "../styles";

import MetadataList from "../listing";
import SlideUpTransition from "../SlideUpTransition";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { ERROR } from "components/announcer/AnnouncerConstants";
import FormTextField from "components/forms/FormTextField";
import getFormError from "components/forms/getFormError";

import {
    Button,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Typography,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles(styles);

const AVUFormDialog = (props) => {
    const {
        avu,
        open,
        closeAttrDialog,
        editable,
        targetName,
        field,
        touched,
        errors,
    } = props;

    const { attr, avus } = avu;

    const [editingAttrIndex, setEditingAttrIndex] = React.useState(-1);

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    const avuErrors = getFormError(field, touched, errors);
    const error = avuErrors && avuErrors.error;

    const formID = buildID(ids.EDIT_METADATA_FORM, field, ids.DIALOG);

    const title = t(
        editable ? "dialogTitleEditMetadataFor" : "dialogTitleViewMetadataFor",
        { targetName }
    );

    const hasChildren = avus && avus.length > 0;

    const onClose = () => {
        error
            ? announce({
                  text: t("errAVUEditFormAnnounce"),
                  variant: ERROR,
              })
            : closeAttrDialog();
    };

    return (
        <DEDialog
            baseId={formID}
            open={open}
            title={title}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    onClose(event);
                }
            }}
            disableEscapeKeyDown
            TransitionComponent={SlideUpTransition}
            actions={
                <Tooltip
                    title={error ? t("errAVUEditFormAnnounce") : ""}
                    placement="left-start"
                    enterDelay={200}
                >
                    <span>
                        <Button
                            id={buildID(formID, ids.BUTTONS.DONE)}
                            variant="contained"
                            onClick={onClose}
                        >
                            {t("done")}
                        </Button>
                    </span>
                </Tooltip>
            }
        >
            <FastField
                name={`${field}.attr`}
                label={t("attribute")}
                id={buildID(formID, ids.AVU_ATTR)}
                required={editable}
                InputProps={{ readOnly: !editable }}
                component={FormTextField}
            />
            <FastField
                name={`${field}.value`}
                label={t("value")}
                id={buildID(formID, ids.AVU_VALUE)}
                InputProps={{ readOnly: !editable }}
                component={FormTextField}
                multiline
            />
            <FastField
                name={`${field}.unit`}
                label={t("metadataUnitLabel")}
                id={buildID(formID, ids.AVU_UNIT)}
                InputProps={{ readOnly: !editable }}
                component={FormTextField}
            />

            {(editable || hasChildren) && (
                <>
                    <Divider />

                    <Accordion defaultExpanded={hasChildren}>
                        <AccordionSummary
                            expandIcon={
                                <ExpandMoreIcon
                                    id={buildID(
                                        formID,
                                        ids.BUTTONS.EXPAND,
                                        ids.AVU_GRID
                                    )}
                                />
                            }
                        >
                            <Typography variant="subtitle1">
                                {t("metadataChildrenLabel")}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
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
                                            setEditingAttrIndex(index)
                                        }
                                    />
                                )}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <FieldArray
                        name={`${field}.avus`}
                        render={(arrayHelpers) => (
                            <AVUFormList
                                {...arrayHelpers}
                                editingAttrIndex={editingAttrIndex}
                                editable={editable}
                                targetName={attr}
                                closeAttrDialog={() => setEditingAttrIndex(-1)}
                            />
                        )}
                    />
                </>
            )}
        </DEDialog>
    );
};

AVUFormDialog.propTypes = {
    targetName: PropTypes.string,
    closeAttrDialog: PropTypes.func.isRequired,
    avu: PropTypes.shape({
        attr: PropTypes.string.isRequired,
    }).isRequired,
};

const AVUFormList = ({
    editingAttrIndex,
    editable,
    targetName,
    closeAttrDialog,
    name,
    form: { touched, errors, values },
}) => {
    const avus = getIn(values, name);

    return (
        <>
            {avus &&
                avus.map((avu, index) => {
                    const field = `${name}[${index}]`;

                    return (
                        <AVUFormDialog
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
        </>
    );
};

export default AVUFormList;
