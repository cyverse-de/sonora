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

import { build } from "@cyverse-de/ui-lib";

import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";

import { parseNameFromPath, validateDiskResourceName } from "./utils";

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
    const {
        path,
        open,
        onClose,
        onSaveAs,
        saveFileError,
        loading,
        setSaveNewFileError,
    } = props;

    const classes = useStyles();
    const baseId = ids.CREATE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const handleSaveFile = ({ name }, { resetForm }) => {
        onSaveAs(name);
    };

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(
            parseNameFromPath(name),
            t
        );
        return validationError || saveFileError
            ? { name: validationError || saveFileError }
            : {};
    };

    return (
        <Formik
            initialValues={{ name: "" }}
            validate={validate}
            onSubmit={handleSaveFile}
        >
            {({ handleSubmit, validateForm }) => {
                if (saveFileError) {
                    validateForm();
                    setSaveNewFileError();
                }
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
                                    id={build(baseId, ids.FILE_NAME)}
                                    name="name"
                                    required={true}
                                    label={t("fileName")}
                                    loading={loading}
                                    path={path}
                                    component={SaveAsField}
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
