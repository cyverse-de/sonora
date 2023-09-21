/**
 *
 * @author sriram, psarando
 *
 */
import React from "react";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "i18n";

import ErrorTypography from "components/error/ErrorTypography";

import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import FormCheckbox from "components/forms/FormCheckbox";
import FormTextField from "components/forms/FormTextField";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        float: "right",
    },
}));

function CreateSavedLaunchDialog(props) {
    const { baseDebugId, appName, dialogOpen, createSavedLaunch, onHide } =
        props;
    const { t } = useTranslation("apps");
    const [saveError, setSaveError] = React.useState(null);

    const classes = useStyles();

    const handleSubmit = (values, actions) => {
        actions.setSubmitting(true);
        setSaveError(null);

        const { name, description, is_public } = values;

        createSavedLaunch(
            name,
            description,
            is_public,
            () => {
                actions.setSubmitting(false);
                announce({
                    text: t("savedLaunchCreateSuccess", { name }),
                });
                onHide();
            },
            (saveError) => {
                setSaveError(saveError);
                actions.setSubmitting(false);
            }
        );
    };

    return (
        <Dialog open={dialogOpen}>
            <DialogTitle>
                {appName}
                <IconButton
                    className={classes.closeButton}
                    aria-label={t("cancelLabel")}
                    onClick={onHide}
                    size="small"
                    edge="end"
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <Formik
                initialValues={{ name: "", description: "", is_public: false }}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                id={buildID(baseDebugId, ids.SAVED_LAUNCH.NAME)}
                                name="name"
                                label={t("savedLaunchNameLabel")}
                                required={true}
                                component={FormTextField}
                            />

                            <Tooltip title={t("publicSavedLaunchTooltip")}>
                                <div>
                                    <Field
                                        id={buildID(
                                            baseDebugId,
                                            ids.SAVED_LAUNCH.PUBLIC
                                        )}
                                        name="is_public"
                                        label={t("publicLabel")}
                                        required={false}
                                        component={FormCheckbox}
                                    />
                                </div>
                            </Tooltip>

                            <ErrorTypography
                                errorMessage={
                                    (saveError && saveError.message) ||
                                    saveError
                                }
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button
                                id={buildID(
                                    baseDebugId,
                                    ids.SAVED_LAUNCH.CANCEL
                                )}
                                color="primary"
                                disabled={isSubmitting}
                                onClick={onHide}
                            >
                                {t("cancelLabel")}
                            </Button>
                            <Button
                                id={buildID(
                                    baseDebugId,
                                    ids.SAVED_LAUNCH.CREATE
                                )}
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {t("createSavedLaunchLabel")}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default CreateSavedLaunchDialog;
