/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */
import React, { useState } from "react";

import { Field, Form, Formik } from "formik";
import { useTranslation } from "react-i18next";

import { build, FormTextField } from "@cyverse-de/ui-lib";

import ResourceTypes from "components/models/ResourceTypes";
import ids from "./ids";
import { validateDiskResourceName } from "./utils";

import DataSelectionDrawer from "components/data/SelectionDrawer";
import { UploadTrackingProvider } from "contexts/uploadTracking";

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Hidden,
    IconButton,
    InputAdornment,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Close, Folder } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";

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
    const [dest, setDest] = useState(path);
    const [selectionDrawerOpen, setSelectionDrawerOpen] = useState(false);
    const classes = useStyles();
    const baseId = ids.CREATE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const theme = useTheme();

    const handleSaveFile = ({ name }, { resetForm }) => {
        const newPath = `${dest}/${name}`;
        onSaveAs(newPath);
    };

    const validate = ({ name }) => {
        const validationError = validateDiskResourceName(name, t);
        return validationError || saveFileError
            ? { name: validationError || saveFileError }
            : {};
    };

    return (
        <>
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
                                    <div>
                                        <Typography
                                            classes={{
                                                root: classes.bottomPadding,
                                            }}
                                            component="span"
                                        >
                                            {t("newFileLocation", {
                                                path: dest,
                                            })}
                                        </Typography>
                                        <Button
                                            id={build(baseId, ids.SAVE_BTN)}
                                            size="small"
                                            style={{
                                                marginLeft: theme.spacing(1),
                                            }}
                                            variant="outlined"
                                            disableElevation
                                            color="primary"
                                            onClick={() =>
                                                setSelectionDrawerOpen(true)
                                            }
                                            startIcon={
                                                <Folder fontSize="small" />
                                            }
                                        >
                                            <Hidden xsDown>
                                                {t("browse")}
                                            </Hidden>
                                        </Button>
                                    </div>
                                    <Field
                                        id={build(baseId, ids.FILE_NAME)}
                                        name="name"
                                        required={true}
                                        label={t("fileName")}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                handleSubmit();
                                            }
                                        }}
                                        InputProps={{
                                            readOnly: loading,
                                            endAdornment: (
                                                <>
                                                    {loading && (
                                                        <InputAdornment position="start">
                                                            <CircularProgress
                                                                id={build(
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
            <UploadTrackingProvider>
                <DataSelectionDrawer
                    open={selectionDrawerOpen}
                    startingPath={dest}
                    acceptedType={ResourceTypes.Folder}
                    onClose={() => setSelectionDrawerOpen(false)}
                    onConfirm={(selection) => {
                        setDest(selection);
                    }}
                    baseId={build(baseId, "dataSelection")}
                    multiSelect={false}
                />
            </UploadTrackingProvider>
        </>
    );
}

export default SaveAsDialog;
