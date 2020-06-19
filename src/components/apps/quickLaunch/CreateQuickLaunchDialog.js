/**
 *
 * @author sriram, psarando
 *
 */
import React from "react";
import { Field, Form, Formik } from "formik";
import { injectIntl } from "react-intl";

import ErrorTypography from "../../utils/error/ErrorTypography";

import ids from "../ids";
import intlData from "../messages";

import {
    build,
    FormCheckbox,
    FormTextField,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

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
    const {
        intl,
        baseDebugId,
        appName,
        dialogOpen,
        createQuickLaunch,
        onHide,
    } = props;

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
                    aria-label={formatMessage(intl, "cancelLabel")}
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
                                id={build(baseDebugId, ids.QUICK_LAUNCH.name)}
                                name="name"
                                label={getMessage("quickLaunchNameLabel")}
                                required={true}
                                component={FormTextField}
                            />

                            <Tooltip
                                title={formatMessage(intl, "publicQLTooltip")}
                            >
                                <div>
                                    <Field
                                        id={build(
                                            baseDebugId,
                                            ids.QUICK_LAUNCH.public
                                        )}
                                        name="is_public"
                                        label={getMessage("publicLabel")}
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
                                id={build(baseDebugId, ids.QUICK_LAUNCH.cancel)}
                                color="primary"
                                disabled={isSubmitting}
                                onClick={onHide}
                            >
                                {getMessage("cancelLabel")}
                            </Button>
                            <Button
                                id={build(baseDebugId, ids.QUICK_LAUNCH.create)}
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {getMessage("createQuickLaunchLabel")}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            />
        </Dialog>
    );
}

export default withI18N(injectIntl(CreateQuickLaunchDialog), intlData);
