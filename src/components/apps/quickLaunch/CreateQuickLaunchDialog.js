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
    makeStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        float: "right",
    },
}));

function CreateQuickLaunchDialog(props) {
    const { baseDebugId, appName, dialogOpen, createQuickLaunch, onHide } =
        props;
    const { t } = useTranslation("apps");
    const [saveError, setSaveError] = React.useState(null);

    const classes = useStyles();

    const handleSubmit = (values, actions) => {
        actions.setSubmitting(true);
        setSaveError(null);

        const { name, description, is_public } = values;

        createQuickLaunch(
            name,
            description,
            is_public,
            () => {
                actions.setSubmitting(false);
                announce({
                    text: t("quickLaunchCreateSuccess", { name }),
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
                render={({ isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                id={buildID(baseDebugId, ids.QUICK_LAUNCH.NAME)}
                                name="name"
                                label={t("quickLaunchNameLabel")}
                                required={true}
                                component={FormTextField}
                            />

                            <Tooltip title={t("publicQLTooltip")}>
                                <div>
                                    <Field
                                        id={buildID(
                                            baseDebugId,
                                            ids.QUICK_LAUNCH.PUBLIC
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
                                    ids.QUICK_LAUNCH.CANCEL
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
                                    ids.QUICK_LAUNCH.CREATE
                                )}
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {t("createQuickLaunchLabel")}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            />
        </Dialog>
    );
}

export default CreateQuickLaunchDialog;
