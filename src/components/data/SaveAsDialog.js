/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */
import React from "react";

import { Field, Form, Formik } from "formik";

import { useTranslation } from "react-i18next";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import SaveAsField from "./SaveAsField";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import DEDialog from "components/utils/DEDialog";
import { validateDiskResourceName } from "./utils";

import { Button } from "@material-ui/core";

function SaveAsDialog(props) {
    const { path, open, onClose, onSaveAs, saveFileError, loading } = props;

    const baseId = ids.CREATE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const handleSaveFile = ({ dest, name }) => {
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
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={i18nCommon("saveAs")}
                            actions={
                                <>
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
                                </>
                            }
                        >
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
                                component={SaveAsField}
                                {...textFieldProps}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default SaveAsDialog;
