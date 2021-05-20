/**
 * A form component for adding, ordering, and deleting App steps.
 *
 * @author psarando
 */
import React from "react";

import { FieldArray } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "../commonStyles";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DeleteButton from "components/utils/DeleteButton";

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

import { Delete, ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles(styles);

function AppStep(props) {
    const { baseId, fieldName, step, onDelete, onMoveDown, onMoveUp } = props;

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const stepBaseId = buildID(baseId, fieldName);

    return (
        <Card>
            <CardHeader
                title={step.name}
                titleTypographyProps={{ variant: "subtitle1" }}
                subheader={step.description}
                action={
                    <ButtonGroup variant="text" color="primary">
                        {isMobile ? (
                            <DotMenu
                                baseId={stepBaseId}
                                ButtonProps={{ color: "inherit" }}
                                render={(onClose) => [
                                    <MenuItem
                                        key={ids.BUTTONS.MOVE_UP_BTN}
                                        id={buildID(
                                            stepBaseId,
                                            ids.BUTTONS.MOVE_UP_BTN
                                        )}
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
                                        id={buildID(
                                            stepBaseId,
                                            ids.BUTTONS.MOVE_DOWN_BTN
                                        )}
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
                                        id={buildID(
                                            stepBaseId,
                                            ids.BUTTONS.DELETE_BTN
                                        )}
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
                                    id={buildID(
                                        stepBaseId,
                                        ids.BUTTONS.MOVE_UP_BTN
                                    )}
                                    aria-label={t("moveUp")}
                                    onClick={onMoveUp}
                                >
                                    <ArrowUpward />
                                </Button>,
                                <Button
                                    key={ids.BUTTONS.MOVE_DOWN_BTN}
                                    id={buildID(
                                        stepBaseId,
                                        ids.BUTTONS.MOVE_DOWN_BTN
                                    )}
                                    aria-label={t("moveDown")}
                                    onClick={onMoveDown}
                                >
                                    <ArrowDownward />
                                </Button>,
                                <DeleteButton
                                    key={ids.BUTTONS.DELETE_BTN}
                                    baseId={stepBaseId}
                                    // Has to be reset in a ButtonGroup it seems
                                    className={classes.deleteIcon}
                                    onClick={onDelete}
                                />,
                            ]
                        )}
                    </ButtonGroup>
                }
            />
        </Card>
    );
}

function AppOrder(props) {
    const { baseId, steps } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["workflows", "common"]);

    return (
        <FieldArray
            name="steps"
            render={(arrayHelpers) => (
                <>
                    {steps?.map((step, index) => (
                        <AppStep
                            key={step.task_id}
                            baseId={baseId}
                            fieldName={`steps.${index}`}
                            step={step}
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
            )}
        />
    );
}

export default AppOrder;
