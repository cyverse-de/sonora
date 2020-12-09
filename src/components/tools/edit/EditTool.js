/**
 * @author aramsey
 */
import React from "react";

import { useTranslation } from "i18n";

import DEDialog from "components/utils/DEDialog";
import ContainerDevices from "./ContainerDevices";
import ContainerImage from "./ContainerImage";
import ContainerPorts from "./ContainerPorts";
import ContainerVolumes from "./ContainerVolumes";
import ContainerVolumesFrom from "./ContainerVolumesFrom";
import ids from "../ids";
import Restrictions from "./ToolRestrictions";
import styles from "../styles";
import ToolImplementation from "./ToolImplementation";
import { nonEmptyField } from "./Validations";

import PropTypes from "prop-types";
import {
    build,
    FormMultilineTextField,
    FormNumberField,
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib";
import { Field, FieldArray, Form, getIn, withFormik } from "formik";
import { Button, MenuItem, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

function EditToolDialog(props) {
    const {
        open,
        parentId,
        tool,
        loading,
        isAdmin,
        isAdminPublishing,
        toolTypes,
        maxCPUCore,
        maxMemory,
        maxDiskSpace,
        handleSubmit,
        values,
        presenter,
    } = props;

    const { t } = useTranslation("tools");

    return (
        <DEDialog
            open={open}
            fullWidth={true}
            maxWidth="lg"
            onClose={() => presenter.closeEditToolDlg()}
            id={parentId}
            title={
                tool
                    ? t("editTool", {
                          name: tool.name,
                      })
                    : t("addTool")
            }
            actions={
                <>
                    <Button
                        variant="contained"
                        id={build(parentId, ids.BUTTONS.CANCEL)}
                        onClick={() => presenter.closeEditToolDlg()}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="contained"
                        id={build(parentId, ids.BUTTONS.SAVE)}
                        type="submit"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {isAdminPublishing ? t("makePublic") : t("save")}
                    </Button>
                </>
            }
        >
            <StyledEditToolForm
                values={values}
                isAdmin={isAdmin}
                parentId={parentId}
                toolTypes={toolTypes}
                maxCPUCore={maxCPUCore}
                maxMemory={maxMemory}
                maxDiskSpace={maxDiskSpace}
            />
        </DEDialog>
    );
}

const StyledEditToolForm = withStyles(styles)(EditToolForm);

function EditToolForm(props) {
    const {
        isAdmin,
        values,
        parentId,
        toolTypes,
        maxCPUCore,
        maxMemory,
        maxDiskSpace,
        classes,
    } = props;

    const { t } = useTranslation("tools");

    const selectedToolType = getIn(values, "type");
    const isOSGTool = selectedToolType === "osg";
    const isInteractiveTool = selectedToolType === "interactive";

    return (
        <Form>
            <Field
                name="name"
                label={t("toolName")}
                id={build(parentId, ids.EDIT_TOOL_DLG.NAME)}
                required
                validate={nonEmptyField}
                component={FormTextField}
            />
            <Field
                name="description"
                label={t("toolDesc")}
                id={build(parentId, ids.EDIT_TOOL_DLG.DESCRIPTION)}
                component={FormMultilineTextField}
            />
            <Field
                name="version"
                label={t("toolVersion")}
                id={build(parentId, ids.EDIT_TOOL_DLG.VERSION)}
                required
                validate={nonEmptyField}
                component={FormTextField}
            />
            {isAdmin && (
                <Field
                    name="attribution"
                    label={t("attribution")}
                    id={build(parentId, ids.EDIT_TOOL_DLG.ATTRIBUTION)}
                    component={FormTextField}
                />
            )}
            {isAdmin && (
                <Field
                    name="location"
                    label={t("location")}
                    id={build(parentId, ids.EDIT_TOOL_DLG.LOCATION)}
                    component={FormTextField}
                />
            )}
            <Field
                name="type"
                validate={nonEmptyField}
                render={({ field: { onChange, ...field }, ...props }) => (
                    <FormSelectField
                        {...props}
                        label={t("type")}
                        required
                        field={field}
                        onChange={(event) => {
                            resetOnTypeChange(event.target.value, props.form);
                            onChange(event);
                        }}
                        id={build(parentId, ids.EDIT_TOOL_DLG.TYPE)}
                    >
                        {toolTypes.map((type, index) => (
                            <MenuItem
                                key={index}
                                value={type}
                                id={build(
                                    parentId,
                                    ids.EDIT_TOOL_DLG.TYPE,
                                    type
                                )}
                            >
                                {type}
                            </MenuItem>
                        ))}
                    </FormSelectField>
                )}
            />
            {isAdmin && (
                <Field
                    name="implementation"
                    isAdmin={isAdmin}
                    parentId={build(
                        parentId,
                        ids.EDIT_TOOL_DLG.TOOL_IMPLEMENTATION
                    )}
                    component={ToolImplementation}
                />
            )}
            <Field
                name={"container.image"}
                parentId={parentId}
                isOSGTool={isOSGTool}
                component={ContainerImage}
                t={t}
            />
            {isAdmin && (
                <Field
                    name="container.name"
                    label={t("containerName")}
                    id={build(parentId, ids.EDIT_TOOL_DLG.CONTAINER_NAME)}
                    component={FormTextField}
                />
            )}
            {isAdmin && (
                <Paper elevation={1} classes={{ root: classes.paper }}>
                    <Typography variant="body2">
                        {t("entrypointWarning")}
                    </Typography>
                </Paper>
            )}
            <Field
                name="container.entrypoint"
                label={t("entrypoint")}
                id={build(parentId, ids.EDIT_TOOL_DLG.ENTRYPOINT)}
                component={FormTextField}
            />
            <Field
                name="container.working_directory"
                label={t("workingDirectory")}
                id={build(parentId, ids.EDIT_TOOL_DLG.WORKING_DIR)}
                component={FormTextField}
            />
            <Field
                name="container.uid"
                label={t("containerUID")}
                id={build(parentId, ids.EDIT_TOOL_DLG.CONTAINER_UID)}
                component={FormNumberField}
            />
            {(isAdmin || isInteractiveTool) && (
                <FieldArray
                    name="container.container_ports"
                    render={(arrayHelpers) => (
                        <ContainerPorts
                            isAdmin={isAdmin}
                            parentId={build(
                                parentId,
                                ids.EDIT_TOOL_DLG.CONTAINER_PORTS
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
            {isAdmin && (
                <FieldArray
                    name="container.container_devices"
                    render={(arrayHelpers) => (
                        <ContainerDevices
                            parentId={build(
                                parentId,
                                ids.EDIT_TOOL_DLG.CONTAINER_DEVICES
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
            {isAdmin && (
                <Paper elevation={1} classes={{ root: classes.paper }}>
                    <Typography variant="body2">
                        {t("volumesWarning")}
                    </Typography>
                </Paper>
            )}
            {isAdmin && (
                <FieldArray
                    name="container.container_volumes"
                    render={(arrayHelpers) => (
                        <ContainerVolumes
                            parentId={build(
                                parentId,
                                ids.EDIT_TOOL_DLG.CONTAINER_VOLUMES
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
            {isAdmin && (
                <FieldArray
                    name="container.container_volumes_from"
                    render={(arrayHelpers) => (
                        <ContainerVolumesFrom
                            parentId={build(
                                parentId,
                                ids.EDIT_TOOL_DLG.CONTAINER_VOLUMES
                            )}
                            {...arrayHelpers}
                        />
                    )}
                />
            )}
            <Field
                isAdmin={isAdmin}
                parentId={build(parentId, ids.EDIT_TOOL_DLG.RESTRICTIONS)}
                maxDiskSpace={maxDiskSpace}
                maxCPUCore={maxCPUCore}
                maxMemory={maxMemory}
                component={Restrictions}
            />
        </Form>
    );
}

/**
 * Ensures that if the user previously filled out information for an OSG
 * or interactive/VICE tool, and then selects a different type,
 * that those fields get cleared out to prevent any validation errors and
 * also to prevent empty values being unintentionally sent to the service.
 *
 * Also auto-sets the container.network_mode based on tool type
 *
 * @param currentType
 * @param form
 */
function resetOnTypeChange(currentType, form) {
    if (currentType !== "osg") {
        form.setFieldValue("container.image.osg_image_path", null);
    }
    if (currentType !== "interactive") {
        form.setFieldValue("container.container_ports", null);
        form.setFieldValue("container.network_mode", "none");
    } else {
        form.setFieldValue("container.network_mode", "bridge");
    }
}

const handleSubmit = (values, { props }) => {
    const { tool, presenter, isAdmin, isAdminPublishing } = props;
    if (tool) {
        if (isAdmin && isAdminPublishing) {
            presenter.onPublish(values);
        } else {
            presenter.updateTool(values);
        }
    } else {
        presenter.addTool(values);
    }
};

const DEFAULT_TOOL = {
    name: "",
    version: "",
    container: {
        image: {
            name: "",
            tag: "",
            osg_image_path: "",
        },
    },
    type: "",
};

const DEFAULT_ADMIN_TOOL = {
    ...DEFAULT_TOOL,
    implementation: {
        implementor: "",
        implementor_email: "",
        test: {
            input_files: [],
            output_files: [],
        },
    },
};

function mapPropsToValues(props) {
    const { tool, isAdmin } = props;
    if (!tool) {
        return isAdmin ? { ...DEFAULT_ADMIN_TOOL } : { ...DEFAULT_TOOL };
    } else {
        return { ...tool };
    }
}

EditToolDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isAdminPublishing: PropTypes.bool.isRequired,
    presenter: function (props, propName, componentName) {
        let presenterFuncs = props[propName];
        if (!presenterFuncs["closeEditToolDlg"]) {
            return new Error(
                "`presenter` in `" +
                    componentName +
                    "` missing required prop `closeEditToolDlg`"
            );
        }
        if (
            !(
                (presenterFuncs["addTool"] && presenterFuncs["updateTool"]) ||
                presenterFuncs["onPublish"]
            )
        ) {
            return new Error(
                "`presenter` in `" +
                    componentName +
                    "` must have either `addTool` and " +
                    "`updateTool`, or `onPublish`"
            );
        }
    },
    loading: PropTypes.bool.isRequired,
    tool: PropTypes.object,
    parentId: PropTypes.string.isRequired,
    toolTypes: PropTypes.array.isRequired,
    maxCPUCore: PropTypes.number.isRequired,
    maxMemory: PropTypes.number.isRequired,
    maxDiskSpace: PropTypes.number.isRequired,
};

export default withFormik({
    enableReinitialize: true,
    mapPropsToValues,
    handleSubmit,
})(EditToolDialog);
