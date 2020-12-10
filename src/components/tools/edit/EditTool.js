/**
 * @author aramsey, sriram
 */
import React, { useState } from "react";

import { useTranslation } from "i18n";
<<<<<<< HEAD
import { useQuery, useMutation, queryCache } from "react-query";

import TOOL_TYPES from "components/models/ToolTypes";

=======
import { useQuery, useMutation } from "react-query";

>>>>>>> 7265d3e... Hook up service calls. Refactor code.
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
import constants from "../../../constants";

import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import {
    getToolTypes,
    addTool,
    updateTool,
    getToolDetails,
    TOOL_TYPES_QUERY_KEY,
    TOOL_DETAILS_QUERY_KEY,
    TOOLS_QUERY_KEY,
} from "serviceFacades/tools";

<<<<<<< HEAD
=======
import {
    TOOL_TYPES_QUERY_KEY,
    getToolTypes,
    getToolDetails,
    TOOL_DETAILS_QUERY_KEY,
    addTool,
    updateTool,
} from "serviceFacades/tools";

>>>>>>> 7265d3e... Hook up service calls. Refactor code.
import {
    announce,
    build,
    FormMultilineTextField,
    FormNumberField,
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import { Field, FieldArray, Form, getIn, Formik } from "formik";
<<<<<<< HEAD
import {
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Typography,
} from "@material-ui/core";
=======
import { Button, Grid, MenuItem, Paper, Typography } from "@material-ui/core";
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
import { withStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

function EditToolDialog(props) {
<<<<<<< HEAD
    const { open, parentId, tool, isAdmin, isAdminPublishing, onClose } = props;

    const { t } = useTranslation("tools");
    const [toolTypes, setToolTypes] = useState([]);
    const [addToolError, setAddToolError] = useState();
    const [updateToolError, setUpdateToolError] = useState();
=======
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
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
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
<<<<<<< HEAD
            staleTime: Infinity,
            cacheTime: Infinity,
            onSuccess: (data) => {
                if (data?.tool_types?.length > 0) {
=======
            onSuccess: (data) => {
                if (
                    data &&
                    data["tool_types"] &&
                    data["tool_types"].length > 0
                ) {
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
                    setToolTypes(
                        data["tool_types"]
                            .filter(
                                (type) =>
<<<<<<< HEAD
                                    type.name !== TOOL_TYPES.INTERNAL &&
                                    type.name !== TOOL_TYPES.FAPI
=======
                                    type.name !== "internal" &&
                                    type.name !== "fAPI"
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
                            )
                            .map((type) => type.name)
                    );
                }
            },
        },
    });
<<<<<<< HEAD

=======
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
    const { isFetching: isToolFetching, error: toolFetchError } = useQuery({
        queryKey: [TOOL_DETAILS_QUERY_KEY, { id: tool?.id }],
        queryFn: getToolDetails,
        config: {
<<<<<<< HEAD
            enabled: tool && open,
=======
            enabled: tool !== null && tool !== undefined,
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
            onSuccess: setSelectedTool,
        },
    });

    const [addNewTool, { status: newToolStatus }] = useMutation(
        ({ submission }) => addTool(submission),
        {
            onSuccess: (data) => {
<<<<<<< HEAD
                announce({
                    text: t("toolAdded"),
                });
                queryCache.invalidateQueries(TOOLS_QUERY_KEY);
                setAddToolError(null);
                onClose();
            },
            onError: setAddToolError,
=======
                console.log("Tool added=>" + JSON.stringify(data));
            },
            onError: (error) => {
                console.log("Error adding tool=>" + error);
            },
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
        }
    );

    const [updateCurrentTool, { status: updateToolStatus }] = useMutation(
        ({ submission }) => updateTool(submission),
        {
            onSuccess: (data) => {
<<<<<<< HEAD
                announce({
                    text: t("toolUpdated"),
                });
                queryCache.invalidateQueries(TOOLS_QUERY_KEY);
                setUpdateToolError(null);
                onClose();
            },
            onError: setUpdateToolError,
=======
                console.log("Tool updated=>" + JSON.stringify(data));
            },
            onError: (error) => {
                console.log("Error updating tool=>" + error);
            },
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
        }
    );

    const handleSubmit = (values, { props }) => {
<<<<<<< HEAD
        const submission = { ...values };

        //these keys needs to added to submission for interactive tools
        if (submission.interactive) {
            const interactive_apps = {
                cas_url: config.vice.defaultCasUrl,
                name: config.vice.defaultName,
                image: config.vice.defaultImage,
                cas_validate: config.vice.defaultCasValidate,
            };
            submission.container.interactive_apps = interactive_apps;
            submission.container.skip_tmp_mount = true;
        }

        //avoid dupe submission
        if (
            newToolStatus !== constants.LOADING &&
            updateToolStatus !== constants.LOADING
        ) {
            if (tool) {
                updateCurrentTool({ submission });
            } else {
                addNewTool({ submission });
            }
=======
        /*         if (tool) {
            if (isAdmin && isAdminPublishing) {
                presenter.onPublish(values);
            } else {
                presenter.updateTool(values);
            }
        } else {
            presenter.addTool(values);
        } */
        const submission = { tool: { ...values } };
        if (tool) {
            updateCurrentTool({ submission });
        } else {
            addNewTool({ submission });
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
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

<<<<<<< HEAD
            {(newToolStatus === constants.LOADING ||
                updateToolStatus === constants.LOADING) && (
                <CircularProgress
                    size={30}
                    thickness={5}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}

            {toolTypeError && (
                <ErrorTypographyWithDialog
                    errorObject={toolTypeError}
                    errorMessage={t("toolTypesFetchError")}
                    baseId={parentId}
                />
            )}
            {toolFetchError && (
                <ErrorTypographyWithDialog
                    errorObject={toolFetchError}
                    errorMessage={t("toolInfoError")}
                    baseId={parentId}
                />
            )}

            {addToolError && (
                <ErrorTypographyWithDialog
                    errorObject={addToolError}
                    errorMessage={t("toolAddError")}
                />
            )}
            {updateToolError && (
                <ErrorTypographyWithDialog
                    errorObject={updateToolError}
                    errorMessage={t("toolUpdateError")}
                />
            )}

            {!isToolTypeFetching && !isToolFetching && (
                <Formik
                    initialValues={mapPropsToValues(selectedTool, isAdmin)}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ values }) => {
                        return (
                            <Form>
                                <StyledEditToolForm
=======
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
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
                                    isAdmin={isAdmin}
                                    parentId={parentId}
                                    toolTypes={toolTypes}
                                    maxCPUCore={maxCPUCore}
                                    maxMemory={maxMemory}
                                    maxDiskSpace={maxDiskSpace}
<<<<<<< HEAD
                                    values={values}
=======
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
                                />
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="flex-end"
<<<<<<< HEAD
                                    spacing={1}
                                >
                                    {toolTypeError && (
                                        <Grid item xs>
                                            <ErrorTypographyWithDialog
                                                errorObject={toolTypeError}
                                                errorMessage={t(
                                                    "toolTypesFetchError"
                                                )}
                                                baseId={parentId}
                                            />
                                        </Grid>
                                    )}
                                    {toolFetchError && (
                                        <Grid item xs>
                                            <ErrorTypographyWithDialog
                                                errorObject={toolFetchError}
                                                errorMessage={t(
                                                    "toolInfoError"
                                                )}
                                                baseId={parentId}
                                            />
                                        </Grid>
                                    )}

                                    {addToolError && (
                                        <Grid item xs>
                                            <ErrorTypographyWithDialog
                                                errorObject={addToolError}
                                                errorMessage={t("toolAddError")}
                                            />
                                        </Grid>
                                    )}
                                    {updateToolError && (
                                        <Grid item xs>
                                            <ErrorTypographyWithDialog
                                                errorObject={updateToolError}
                                                errorMessage={t(
                                                    "toolUpdateError"
                                                )}
                                            />
                                        </Grid>
                                    )}

=======
                                    spacing={2}
                                >
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
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
        parentId,
        toolTypes,
        maxCPUCore,
        maxMemory,
        maxDiskSpace,
        classes,
        values,
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
                validate={(value) => nonEmptyField(value, t)}
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
                validate={(value) => nonEmptyField(value, t)}
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

<<<<<<< HEAD
const DEFAULT_TOOL = {
=======
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

/* const DEFAULT_TOOL = {
>>>>>>> 7265d3e... Hook up service calls. Refactor code.
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

function mapPropsToValues(tool, isAdmin) {
    if (!tool) {
        return isAdmin ? { ...DEFAULT_ADMIN_TOOL } : { ...DEFAULT_TOOL };
    } else {
        const values = { ...tool };
        //these keys needs to excluded from submission to avoid service errors
        delete values.permission;
        delete values.is_public;
        delete values.container.image.id;
        if (!isAdmin) {
            delete values.implementation;
        }

        return values;
    }
}

<<<<<<< HEAD
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
    if (currentType !== TOOL_TYPES.INTERACTIVE) {
        form.setFieldValue("container.container_ports", null);
        form.setFieldValue("container.network_mode", "none");
    } else {
        form.setFieldValue("container.network_mode", "bridge");
    }
}
=======
EditToolDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isAdminPublishing: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    tool: PropTypes.object,
    parentId: PropTypes.string.isRequired,
}; */
>>>>>>> 7265d3e... Hook up service calls. Refactor code.

export default EditToolDialog;
