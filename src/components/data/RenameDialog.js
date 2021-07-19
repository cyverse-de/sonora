/**
 * @author sriram
 *
 * A dialog that allows users to rename a file / folder
 */
import React, { useState } from "react";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import {
    Button,
    CircularProgress,
    InputAdornment,
    Typography,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import { ERROR_CODES, getErrorCode } from "../error/errorCode";
import DEDialog from "components/utils/DEDialog";
import ids from "./ids";
import {
    validateDiskResourceName,
    parseNameFromPath,
    getParentPath,
} from "./utils";
import { rename } from "serviceFacades/filesystem";
import isQueryLoading from "components/utils/isQueryLoading";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";

const useStyles = makeStyles(styles);

function RenameDialog(props) {
    const { path, open, onClose, onRenamed } = props;
    const [renameError, setRenameError] = useState(null);
    const classes = useStyles();
    const baseId = ids.RENAME_DLG;
    const { t } = useTranslation("data");

    const [resourceRename, { status: renameStatus }] = useMutation(rename, {
        onSuccess: (data, { resetForm }) => {
            setRenameError(null);
            announce({
                text: t("asyncRenamePending"),
                variant: INFO,
            });
            resetForm();
            onRenamed();
        },
        onError: (error) => {
            const text =
                getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                    ? t("resourceExists", { path: getParentPath(path) })
                    : t("renameFail");
            setRenameError(text);
        },
    });

    const handleRename = ({ name }, { resetForm }) => {
        const newPath = `${getParentPath(path)}/${name}`;
        resourceRename({ dest: newPath, source: path, resetForm });
    };

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(name, t);
        return validationError ? { name: validationError } : {};
    };

    const isLoading = isQueryLoading(renameStatus);
    const textFieldProps = {};
    if (renameError) {
        textFieldProps.error = true;
        textFieldProps.helperText = renameError;
    }

    return (
        <Formik
            initialValues={{ name: parseNameFromPath(path) }}
            validate={validate}
            onSubmit={handleRename}
            enableReinitialize
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            maxWidth="sm"
                            fullWidth
                            title={t("rename")}
                            actions={
                                <>
                                    <Button
                                        id={buildID(baseId, ids.CANCEL_BTN)}
                                        onClick={onClose}
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        id={buildID(baseId, ids.RENAME_BTN)}
                                        color="primary"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        {t("rename")}
                                    </Button>
                                </>
                            }
                        >
                            <Typography
                                classes={{ root: classes.bottomPadding }}
                            >
                                {t("path")}: {getParentPath(path)}
                            </Typography>
                            <Field
                                id={buildID(baseId, ids.NAME)}
                                name="name"
                                required={true}
                                label={t("name")}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSubmit();
                                    }
                                }}
                                InputProps={{
                                    readOnly: isLoading,
                                    endAdornment: (
                                        <>
                                            {isLoading && (
                                                <InputAdornment position="start">
                                                    <CircularProgress
                                                        id={buildID(
                                                            baseId,
                                                            ids.FOLDER_NAME,
                                                            ids.LOADING_SKELETON
                                                        )}
                                                        color="inherit"
                                                        size={20}
                                                    />
                                                </InputAdornment>
                                            )}
                                        </>
                                    ),
                                }}
                                component={FormTextField}
                                {...textFieldProps}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default RenameDialog;
