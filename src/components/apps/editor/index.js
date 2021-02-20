/**
 * A component for creating and editing Apps.
 *
 * @author psarando
 */
import React from "react";

import { FastField, Formik } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import ParamGroups from "./ParamGroups";
import ParamPropertyForm from "./ParamPropertyForm";

import AppParamTypes from "components/models/AppParamTypes";
import ApplyButton from "components/utils/ApplyButton";
import DEDialog from "components/utils/DEDialog";

import {
    build as buildID,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";

import {
    Divider,
    Paper,
    Toolbar,
    Typography,
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

/**
 * Initializes the form values from the given App Description.
 *
 * Removes the optional `name` field from groups and
 * initializes each text parameter's `defaultValue` to an empty string.
 *
 * @param {Object} appDescription
 * @param {Object[]} appDescription.groups
 * @param {Object[]} appDescription.groups.parameters
 *
 * @returns Initial form values.
 */
const initValues = (appDescription) => {
    const { groups } = appDescription;

    const initializedGroups = groups?.map(({ name, ...group }) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const { defaultValue, type: paramType } = param;

            switch (paramType) {
                case AppParamTypes.TEXT:
                case AppParamTypes.MULTILINE_TEXT:
                    return {
                        ...param,
                        defaultValue: defaultValue || "",
                    };

                case AppParamTypes.INTEGER:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseInt(defaultValue)
                                : "",
                    };

                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? Number.parseFloat(defaultValue)
                                : "",
                    };

                default:
                    return param;
            }
        }),
    }));

    return { ...appDescription, groups: initializedGroups };
};

/**
 * Formats the form values for submission to the service.
 *
 * @param {Object} appDescription
 * @param {Object[]} appDescription.groups
 * @param {Object[]} appDescription.groups.parameters
 *
 * @returns The App Description formatted for submission to the service.
 */
const formatSubmission = (appDescription) => {
    const { groups } = appDescription;

    const formattedGroups = groups?.map((group) => ({
        ...group,
        parameters: group.parameters?.map((param) => {
            const { defaultValue, type: paramType } = param;

            switch (paramType) {
                case AppParamTypes.TEXT:
                case AppParamTypes.MULTILINE_TEXT:
                    return {
                        ...param,
                        defaultValue: defaultValue || null,
                    };

                case AppParamTypes.INTEGER:
                case AppParamTypes.DOUBLE:
                    return {
                        ...param,
                        defaultValue:
                            defaultValue || defaultValue === 0
                                ? defaultValue
                                : null,
                    };

                default:
                    return param;
            }
        }),
    }));

    return { ...appDescription, groups: formattedGroups };
};

const AppEditor = (props) => {
    const { baseId, appDescription } = props;

    const [editingGroupIndex, setEditingGroupIndex] = React.useState(-1);
    const groupDialogOpen = editingGroupIndex >= 0;
    const onGroupDialogClose = () => setEditingGroupIndex(-1);

    const [editingParamMap, setEditingParamMap] = React.useState({});
    const paramDialogOpen = !!editingParamMap.param;
    const onParamDialogClose = () => setEditingParamMap({});

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);
    const classes = useStyles();

    return (
        <Formik
            enableReinitialize
            initialValues={initValues({ ...appDescription })}
            validate={(values) => {
                const errors = {};

                if (!values.name) {
                    errors.error = true;
                    errors.name = t("common:required");
                }
                if (!values.description) {
                    errors.error = true;
                    errors.description = t("common:required");
                }

                // TODO add a flag for saveable-errors,
                // so user can save work-in-progress but get a warning
                return errors;
            }}
            onSubmit={(values, actions) => {
                // FIXME submit to service
                console.log(formatSubmission(values));
                actions.resetForm({ values });
            }}
        >
            {({ handleSubmit, isSubmitting, dirty, errors, values }) => {
                const applyDisabled = isSubmitting || !dirty || errors.error;

                return (
                    <Paper>
                        <Toolbar>
                            <Typography variant="h6" className={classes.flex}>
                                {t("appIntegrationPageHeader", {
                                    name: values.name || t("newApp"),
                                })}
                            </Typography>
                            <ApplyButton
                                id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                                type="submit"
                                applyDisabled={applyDisabled}
                                onApply={handleSubmit}
                            />
                        </Toolbar>
                        <FastField
                            id={buildID(baseId, ids.APP_NAME)}
                            name="name"
                            label={t("appName")}
                            required
                            component={FormTextField}
                        />
                        <FastField
                            id={buildID(baseId, ids.APP_DESCRIPTION)}
                            name="description"
                            label={t("appDescription")}
                            required
                            component={FormMultilineTextField}
                        />
                        <FastField
                            id={buildID(baseId, ids.TOOL)}
                            // FIXME fetch tool objects from service
                            name="tools.0.name"
                            label={t("toolUsed")}
                            component={FormTextField}
                        />
                        <Divider />

                        <ParamGroups
                            baseId={baseId}
                            groups={values.groups}
                            setEditingParamMap={setEditingParamMap}
                            setEditingGroupIndex={setEditingGroupIndex}
                        />

                        <DEDialog
                            baseId={baseId}
                            open={groupDialogOpen}
                            onClose={onGroupDialogClose}
                        >
                            {groupDialogOpen && (
                                <FastField
                                    id={buildID(
                                        baseId,
                                        ids.GROUP,
                                        ids.PARAM_FIELDS.LABEL
                                    )}
                                    name={`groups.${editingGroupIndex}.label`}
                                    label={t("sectionLabel")}
                                    component={FormTextField}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            onGroupDialogClose();
                                        }
                                    }}
                                />
                            )}
                        </DEDialog>

                        <ParamPropertyForm
                            baseId={buildID(baseId, ids.PROPERTY_EDITOR)}
                            open={paramDialogOpen}
                            onClose={onParamDialogClose}
                            {...editingParamMap}
                        />
                    </Paper>
                );
            }}
        </Formik>
    );
};

export default AppEditor;
