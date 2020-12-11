/**
 * @author aramsey, sriram
 */
import React, { useState } from "react";

import { useTranslation } from "i18n";
import { useQuery, useMutation } from "react-query";

import TOOL_TYPES from "components/models/ToolTypes";

import { useConfig } from "contexts/config";
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

import {
    TOOL_TYPES_QUERY_KEY,
    getToolTypes,
    getToolDetails,
    TOOL_DETAILS_QUERY_KEY,
    addTool,
    updateTool,
} from "serviceFacades/tools";

import {
    build,
    FormMultilineTextField,
    FormNumberField,
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Field, FieldArray, Form, getIn, Formik } from "formik";
import { Button, Grid, MenuItem, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

function EditToolDialog(props) {
    const {
        open,
        parentId,
        tool,
        isAdmin,
        isAdminPublishing,
        values,
        onClose,
    } = props;

    const { t } = useTranslation("tools");
    const [toolTypes, setToolTypes] = useState([]);
    const [selectedTool, setSelectedTool] = useState();

    const [config] = useConfig();
    const maxCPUCore = config?.tools?.private.max_cpu_limit;
    const maxMemory = config?.tools?.private.max_memory_limit;
    const maxDiskSpace = config?.tools?.private.max_disk_limit;

    const { isFetching: isToolTypeFetching, error: toolTypeError } = useQuery({
        queryKey: TOOL_TYPES_QUERY_KEY,
        queryFn: getToolTypes,
        config: {
            enabled: true,
            onSuccess: (data) => {
                if (
                    data &&
                    data["tool_types"] &&
                    data["tool_types"].length > 0
                ) {
                    setToolTypes(
                        data["tool_types"]
                            .filter(
                                (type) =>
                                    type.name !== TOOL_TYPES.INTERNAL &&
                                    type.name !== TOOL_TYPES.FAPI
                            )
                            .map((type) => type.name)
                    );
                }
            },
        },
    });
    const { isFetching: isToolFetching, error: toolFetchError } = useQuery({
        queryKey: [TOOL_DETAILS_QUERY_KEY, { id: tool?.id }],
        queryFn: getToolDetails,
        config: {
            enabled: tool !== null && tool !== undefined,
            onSuccess: setSelectedTool,
        },
    });

    const [addNewTool, { status: newToolStatus }] = useMutation(
        ({ submission }) => addTool(submission),
        {
            onSuccess: (data) => {
                console.log("Tool added=>" + JSON.stringify(data));
            },
            onError: (error) => {
                console.log("Error adding tool=>" + error);
            },
        }
    );

    const [updateCurrentTool, { status: updateToolStatus }] = useMutation(
        ({ submission }) => updateTool(submission),
        {
            onSuccess: (data) => {
                console.log("Tool updated=>" + JSON.stringify(data));
            },
            onError: (error) => {
                console.log("Error updating tool=>" + error);
            },
        }
    );

    const handleSubmit = (values, { props }) => {
        const submission = {};
        if (tool) {
            submission.id = values.id;
        }
        submission.name = values.name;
        submission.description = values.description;
        submission.version = values.version;
        submission.type = values.type;
        submission["time_limit_seconds"] = values["time_limit_seconds"];
        submission.restricted = values.restricted;
        submission.interactive = values.type === TOOL_TYPES.INTERACTIVE;

        submission.container = {};
        submission.container["skip_tmp_mount"] =
            values.container["skip_tmp_mount"];
        submission.container["pids_limit"] = values.container["pids_limit"];
        submission.container["memory_limit"] = values.container["memory_limit"];
        submission.container["network_mode"] = values.container["network_mode"];

        submission.container.image = {};
        submission.container.image.name = values.container.image.name;
        submission.container.image.tag = values.container.image.tag;
        submission.container.image.osg_image_path =
            values.container.image.osg_image_path;

        if (submission.interactive) {
            submission.container["interactive_apps"] = {};
            submission.container["interactive_apps"]["cas_url"] =
                config.vice.defaultImage;
            submission.container["interactive_apps"]["cas_validate"] =
                config.vice.defaultName;
            submission.container["interactive_apps"].image =
                config.vice.defaultCasUrl;
            submission["interactive_apps"].defaultCasValidate =
                config.vice.defaultCasValidate;
            submission.container["skip_tmp_mount"] = true;
            submission.container["network_mode"] = "bridge";
        }

        if (tool) {
            updateCurrentTool({ submission });
        } else {
            addNewTool({ submission });
        }
    };

    return (
        <DEDialog
            open={open}
            fullWidth={true}
            onClose={onClose}
            id={parentId}
            title={
                tool
                    ? t("editTool", {
                          name: tool.name,
                      })
                    : t("addTool")
            }
        >
            {(isToolTypeFetching || isToolFetching) && (
                <Skeleton animation="wave" variant="rect" height={800} />
            )}

            {!isToolTypeFetching && !isToolFetching && (
                <Formik
                    initialValues={{ ...selectedTool }}
                    onSubmit={handleSubmit}
                >
                    {() => {
                        return (
                            <Form>
                                <StyledEditToolForm
                                    values={values}
                                    isAdmin={isAdmin}
                                    parentId={parentId}
                                    toolTypes={toolTypes}
                                    maxCPUCore={maxCPUCore}
                                    maxMemory={maxMemory}
                                    maxDiskSpace={maxDiskSpace}
                                />
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
                                    spacing={2}
                                >
                                    <Grid item>
                                        <Button
                                            id={build(
                                                parentId,
                                                ids.BUTTONS.CANCEL
                                            )}
                                            onClick={onClose}
                                        >
                                            {t("cancel")}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            id={build(
                                                parentId,
                                                ids.BUTTONS.SAVE
                                            )}
                                            type="submit"
                                            color="primary"
                                        >
                                            {isAdminPublishing
                                                ? t("makePublic")
                                                : t("save")}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            )}
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
    const isOSGTool = selectedToolType === TOOL_TYPES.OSG;
    const isInteractiveTool = selectedToolType === TOOL_TYPES.INTERACTIVE;

    return (
        <>
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
            <Field name="type">
                {({ field: { onChange, ...field }, ...props }) => (
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
            </Field>
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
        </>
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
    if (currentType !== TOOL_TYPES.OSG) {
        form.setFieldValue("container.image.osg_image_path", null);
    }
    if (currentType !== "interactive") {
        form.setFieldValue("container.container_ports", null);
        form.setFieldValue("container.network_mode", "none");
    } else {
        form.setFieldValue("container.network_mode", "bridge");
    }
}

export default EditToolDialog;
