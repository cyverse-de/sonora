/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */

import React from "react";

import { Field, Form, Formik } from "formik";

import { useTranslation } from "react-i18next";
import ids from "./ids";
import SaveAsField from "./SaveAsField";
import styles from "./styles";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";

import { build } from "@cyverse-de/ui-lib";

import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";

import { validateDiskResourceName } from "./utils";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

function SaveAsDialog(props) {
    const { path, open, onClose, onSaveAs, saveFileError, loading } = props;

    const classes = useStyles();
    const baseId = ids.CREATE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const handleSaveFile = ({ dest, name }, { resetForm }) => {
        onSaveAs(`${dest}/${name}`);
    };

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(name, t);

        return validationError ? { name: validationError } : {};
    };

    const textFieldProps = {};
    if (saveFileError) {
        textFieldProps.error = true;
        textFieldProps.helperText = saveFileError;
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{ name: "", dest: path }}
            validate={validate}
            onSubmit={handleSaveFile}
        >
            {({ handleSubmit, validateForm }) => {
                return (
                    <Form>
                        <Dialog
                            open={open}
                            onClose={onClose}
                            maxWidth="sm"
                            fullWidth
                        >
                            <DialogTitle>
                                {i18nCommon("saveAs")}
                                <IconButton
                                    aria-label={i18nCommon("cancel")}
                                    onClick={onClose}
                                    size="small"
                                    edge="end"
                                    classes={{ root: classes.closeButton }}
                                >
                                    <Close />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                                <Field
                                    startingPath={path}
                                    name="dest"
                                    id={build(baseId, ids.PATH)}
                                    acceptedType={ResourceTypes.FOLDER}
                                    label={t("newFileLocation")}
                                    component={InputSelector}
                                    required={true}
                                />
                                <Field
                                    id={build(baseId, ids.FILE_NAME)}
                                    name="name"
                                    required={true}
                                    label={t("fileName")}
                                    loading={loading}
                                    path={path}
                                    component={SaveAsField}
                                    {...textFieldProps}
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    id={build(baseId, ids.CANCEL_BTN)}
                                    onClick={onClose}
                                >
                                    {i18nCommon("cancel")}
                                </Button>
                                <Button
                                    id={build(baseId, ids.CREATE_BTN)}
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {i18nCommon("save")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default SaveAsDialog;
