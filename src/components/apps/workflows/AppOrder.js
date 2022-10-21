/**
 * A form component for adding, ordering, and deleting App steps.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray } from "formik";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "../commonStyles";

import AppSearchDrawer from "components/search/detailed/AppSearchDrawer";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DeleteButton from "components/utils/DeleteButton";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { APP_TASKS_QUERY_KEY, getAppTasks } from "serviceFacades/apps";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    ListItemIcon,
    ListItemText,
    MenuItem,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { Add, Delete, ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";

/**
 * Resets a step's output source `step` value when a step is moved.
 *
 * The step's outputs should not be copied into new objects,
 * otherwise formik and the selection menus will lose track of their references
 * to the outputs in any inputs that already have them selected.
 *
 * @param {Object} step The app step that was moved.
 * @param {number} newOutputStep The index to which the step was moved.
 */
const resetOutputStepNumbers = (step, newOutputStep) => {
    if (step.task?.outputs?.length) {
        step.task.outputs.forEach((output) => {
            output.step = newOutputStep;
        });
    }
};

/**
 * Clears the input mappings of the given `step`, if those mappings reference
 * an output of the given `removedStepIndex`.
 *
 * @param {function} setFieldValue Formik's setFieldValue callback.
 * @param {Object} step The step to check for the removed step's outputs.
 * @param {number} stepIndex The index for the `step` param.
 * @param {number} removedStepIndex The index of the removed step.
 */
const resetInputStepMappings = (
    setFieldValue,
    step,
    stepIndex,
    removedStepIndex
) => {
    if (step.task?.inputs?.length) {
        step.task.inputs.forEach((input, inputIndex) => {
            if (input.output.step === removedStepIndex) {
                setFieldValue(
                    `steps.${stepIndex}.task.inputs.${inputIndex}.output`,
                    ""
                );
            }
        });
    }
};

const useStyles = makeStyles(styles);

const AppStepActions = (props) => {
    const { baseId, onDelete, onMoveDown, onMoveUp } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    return (
        <ButtonGroup variant="text" color="primary">
            {isMobile ? (
                <DotMenu
                    baseId={baseId}
                    ButtonProps={{ color: "inherit" }}
                    render={(onClose) => [
                        onMoveUp && (
                            <MenuItem
                                key={ids.BUTTONS.MOVE_UP_BTN}
                                id={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                                onClick={() => {
                                    onClose();
                                    onMoveUp();
                                }}
                            >
                                <ListItemIcon>
                                    <ArrowUpward />
                                </ListItemIcon>
                                <ListItemText primary={t("moveUp")} />
                            </MenuItem>
                        ),
                        onMoveDown && (
                            <MenuItem
                                key={ids.BUTTONS.MOVE_DOWN_BTN}
                                id={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                                onClick={() => {
                                    onClose();
                                    onMoveDown();
                                }}
                            >
                                <ListItemIcon>
                                    <ArrowDownward />
                                </ListItemIcon>
                                <ListItemText primary={t("moveDown")} />
                            </MenuItem>
                        ),
                        <MenuItem
                            key={ids.BUTTONS.DELETE_BTN}
                            id={buildID(baseId, ids.BUTTONS.DELETE_BTN)}
                            onClick={() => {
                                onClose();
                                onDelete();
                            }}
                        >
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <ListItemText primary={t("delete")} />
                        </MenuItem>,
                    ]}
                />
            ) : (
                [
                    onMoveUp && (
                        <Button
                            key={ids.BUTTONS.MOVE_UP_BTN}
                            id={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("moveUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                    ),
                    onMoveDown && (
                        <Button
                            key={ids.BUTTONS.MOVE_DOWN_BTN}
                            id={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            aria-label={t("moveDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                    ),
                    <DeleteButton
                        key={ids.BUTTONS.DELETE_BTN}
                        baseId={baseId}
                        // Has to be reset in a ButtonGroup it seems
                        className={classes.deleteIcon}
                        onClick={onDelete}
                    />,
                ]
            )}
        </ButtonGroup>
    );
};

const AppStep = (props) => {
    const {
        baseId,
        index,
        step,
        onDelete,
        onLoadError,
        onMoveDown,
        onMoveUp,
        updateStep,
    } = props;

    const { system_id: systemId, id: appId } = step;

    const { t } = useTranslation("workflows");

    const { data: tasksData } = useQuery({
        queryKey: [APP_TASKS_QUERY_KEY, { systemId, appId }],
        queryFn: () => getAppTasks({ systemId, appId }),
        enabled: !!(systemId && appId && !step.task),
        onError: onLoadError,
    });

    React.useEffect(() => {
        if (!step.task && tasksData) {
            const fetchedTask = tasksData.tasks[0];

            // Format the fetched task for use in the form.
            const formattedTask = {
                ...fetchedTask,
                inputs: fetchedTask.inputs?.map((input) => ({
                    ...input,
                    output: "",
                })),
                outputs: fetchedTask?.outputs?.map((output) => ({
                    ...output,
                    step: index,
                })),
            };

            // Format the app from search results as a workflow step
            // expected by the form.
            const { system_id, name, description, app_type } = step;

            const formattedStep = {
                task_id: fetchedTask.id,
                system_id,
                name,
                description,
                app_type,
                task: formattedTask,
            };

            updateStep(index, formattedStep);
        }
    }, [index, step, tasksData, updateStep]);

    const stepBaseId = buildID(baseId, "steps", index);
    const isDeprecated = step.task?.tool?.container?.image?.deprecated;
    const stepDescription = isDeprecated
        ? t("appDeprecatedTaskWarning")
        : step.description;

    return (
        <Card>
            <CardHeader
                title={step.name}
                titleTypographyProps={{ variant: "subtitle1" }}
                subheader={step.task ? stepDescription : <Skeleton />}
                subheaderTypographyProps={{
                    color: isDeprecated ? "error" : "textSecondary",
                }}
                action={
                    step.task && (
                        <AppStepActions
                            baseId={stepBaseId}
                            onDelete={onDelete}
                            onMoveDown={onMoveDown}
                            onMoveUp={onMoveUp}
                        />
                    )
                }
            />
        </Card>
    );
};

function AppOrder(props) {
    const { baseId, publicOnly, steps, setFieldValue, showErrorAnnouncer } =
        props;

    const [appSearchDrawerOpen, setAppSearchDrawerOpen] = React.useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["workflows", "common"]);

    const validateAppSelection = (apps) => {
        const invalidApp = apps?.find(
            (app) =>
                !app.pipeline_eligibility.is_valid ||
                app.disabled ||
                (publicOnly && !app.is_public)
        );
        if (invalidApp) {
            return !invalidApp.pipeline_eligibility.is_valid
                ? invalidApp.pipeline_eligibility.reason
                : invalidApp.disabled
                ? t("disabledAppsNotAllowed")
                : t("privateAppsNotAllowed");
        }
        return null;
    };

    return (
        <FieldArray
            name="steps"
            render={(arrayHelpers) => {
                const onConfirmSelectedApps = (apps) => {
                    setAppSearchDrawerOpen(false);

                    apps.forEach((app) => {
                        arrayHelpers.push(app);
                    });
                };

                return (
                    <>
                        <Button
                            id={buildID(baseId, ids.BUTTONS.ADD_APPS)}
                            color="primary"
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setAppSearchDrawerOpen(true)}
                        >
                            {t("common:add")}
                        </Button>

                        <AppSearchDrawer
                            open={appSearchDrawerOpen}
                            onConfirm={onConfirmSelectedApps}
                            onClose={() => setAppSearchDrawerOpen(false)}
                            searchTerm=""
                            validateSelection={validateAppSelection}
                        />

                        {steps?.map((step, index) => {
                            const onMoveUp = () => {
                                resetInputStepMappings(
                                    setFieldValue,
                                    step,
                                    index,
                                    index - 1
                                );

                                resetOutputStepNumbers(step, index - 1);
                                resetOutputStepNumbers(steps[index - 1], index);

                                arrayHelpers.move(index, index - 1);
                            };

                            const onMoveDown = () => {
                                const nextStep = steps[index + 1];

                                resetInputStepMappings(
                                    setFieldValue,
                                    nextStep,
                                    index + 1,
                                    index
                                );

                                resetOutputStepNumbers(step, index + 1);
                                resetOutputStepNumbers(nextStep, index);

                                arrayHelpers.move(index, index + 1);
                            };

                            return (
                                <AppStep
                                    key={buildID(
                                        index,
                                        step.task_id || step.id
                                    )}
                                    baseId={baseId}
                                    index={index}
                                    step={step}
                                    updateStep={arrayHelpers.replace}
                                    onLoadError={(error) => {
                                        showErrorAnnouncer(
                                            t("appTaskFetchError", {
                                                appName: step.name,
                                            }),
                                            error
                                        );
                                        arrayHelpers.remove(index);
                                    }}
                                    onDelete={() =>
                                        setConfirmDeleteIndex(index)
                                    }
                                    onMoveUp={index > 0 && onMoveUp}
                                    onMoveDown={
                                        index < steps.length - 1 && onMoveDown
                                    }
                                />
                            );
                        })}

                        <ConfirmationDialog
                            baseId={ids.DELETE_CONFIRM_DIALOG}
                            open={confirmDeleteIndex >= 0}
                            onClose={onCloseDeleteConfirm}
                            onConfirm={() => {
                                steps
                                    .slice(confirmDeleteIndex)
                                    .forEach((step, index) => {
                                        resetInputStepMappings(
                                            setFieldValue,
                                            step,
                                            index,
                                            confirmDeleteIndex
                                        );
                                    });

                                arrayHelpers.remove(confirmDeleteIndex);

                                onCloseDeleteConfirm();
                            }}
                            confirmButtonText={t("common:delete")}
                            title={t("confirmDeleteStepTitle")}
                            contentText={t("confirmDeleteStepText")}
                        />
                    </>
                );
            }}
        />
    );
}

export default withErrorAnnouncer(AppOrder);
