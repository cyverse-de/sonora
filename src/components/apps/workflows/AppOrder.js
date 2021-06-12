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
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { APP_TASKS_QUERY_KEY, getAppTasks } from "serviceFacades/apps";

import { build as buildID, DotMenu } from "@cyverse-de/ui-lib";

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
                        </MenuItem>,
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
                        </MenuItem>,
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
                    <Button
                        key={ids.BUTTONS.MOVE_UP_BTN}
                        id={buildID(baseId, ids.BUTTONS.MOVE_UP_BTN)}
                        aria-label={t("moveUp")}
                        onClick={onMoveUp}
                    >
                        <ArrowUpward />
                    </Button>,
                    <Button
                        key={ids.BUTTONS.MOVE_DOWN_BTN}
                        id={buildID(baseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                        aria-label={t("moveDown")}
                        onClick={onMoveDown}
                    >
                        <ArrowDownward />
                    </Button>,
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

    const { data: tasksData } = useQuery({
        queryKey: [APP_TASKS_QUERY_KEY, { systemId, appId }],
        queryFn: getAppTasks,
        config: {
            enabled: systemId && appId && !step.task,
            onError: onLoadError,
        },
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

    return (
        <Card>
            <CardHeader
                title={step.name}
                titleTypographyProps={{ variant: "subtitle1" }}
                subheader={step.task ? step.description : <Skeleton />}
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
    const { baseId, steps, showErrorAnnouncer } = props;

    const [appSearchDrawerOpen, setAppSearchDrawerOpen] = React.useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const validateAppSelection = (apps) => {
        const invalidApp = apps?.find(
            (app) => !app.pipeline_eligibility.is_valid
        );
        if (invalidApp) {
            return invalidApp.pipeline_eligibility.reason;
        }
        return null;
    };

    const { t } = useTranslation(["workflows", "common"]);

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
                        {steps?.map((step, index) => (
                            <AppStep
                                key={buildID(index, step.task_id || step.id)}
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
                                onDelete={() => setConfirmDeleteIndex(index)}
                                onMoveUp={() => {
                                    if (index > 0) {
                                        arrayHelpers.move(index, index - 1);
                                    }
                                }}
                                onMoveDown={() => {
                                    if (index < steps.length - 1) {
                                        arrayHelpers.move(index, index + 1);
                                    }
                                }}
                            />
                        ))}
                        <ConfirmationDialog
                            baseId={ids.DELETE_CONFIRM_DIALOG}
                            open={confirmDeleteIndex >= 0}
                            onClose={onCloseDeleteConfirm}
                            onConfirm={() => {
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
