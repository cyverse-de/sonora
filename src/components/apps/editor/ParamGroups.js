/**
 * A form component for creating, editing, and deleting App groups.
 *
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray } from "formik";
import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import Parameters from "./Parameters";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DEDialog from "components/utils/DEDialog";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Typography,
    makeStyles,
} from "@material-ui/core";

import {
    Add,
    Delete,
    Edit,
    ExpandMore,
    ArrowDownward,
    ArrowUpward,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

function ParamGroupForm(props) {
    const { baseId, fieldName, group, onDelete, onMoveDown, onMoveUp } = props;

    const [groupDialogOpen, setGroupDialogOpen] = React.useState(false);
    const onGroupDialogClose = () => setGroupDialogOpen(false);

    const classes = useStyles();
    const { t } = useTranslation("app_editor");

    const groupBaseId = buildID(baseId, fieldName);

    return (
        <Accordion defaultExpanded>
            <AccordionSummary
                className={classes.paramsViewSummary}
                expandIcon={
                    <ExpandMore className={classes.paramsViewsExpandIcon} />
                }
            >
                <Typography className={classes.flex} variant="subtitle2">
                    {group.label}
                </Typography>
                <ButtonGroup color="primary" variant="contained">
                    <Button
                        id={buildID(groupBaseId, ids.BUTTONS.MOVE_UP_BTN)}
                        aria-label={t("moveSectionUp")}
                        onFocus={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onMoveUp();
                        }}
                    >
                        <ArrowUpward />
                    </Button>
                    <Button
                        id={buildID(groupBaseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                        aria-label={t("moveSectionDown")}
                        onFocus={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onMoveDown();
                        }}
                    >
                        <ArrowDownward />
                    </Button>
                    <Button
                        id={buildID(groupBaseId, ids.BUTTONS.EDIT_BTN)}
                        aria-label={t("editSectionProperties")}
                        onFocus={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            setGroupDialogOpen(true);
                        }}
                    >
                        <Edit />
                    </Button>
                    <Button
                        id={buildID(groupBaseId, ids.BUTTONS.DELETE_BTN)}
                        aria-label={t("removeSection")}
                        color="default"
                        className={classes.deleteIcon}
                        onFocus={(event) => event.stopPropagation()}
                        onClick={(event) => {
                            event.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Delete />
                    </Button>
                </ButtonGroup>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
                <Parameters
                    baseId={baseId}
                    groupFieldName={fieldName}
                    parameters={group.parameters}
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
                            name={`${fieldName}.label`}
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
            </AccordionDetails>
        </Accordion>
    );
}

function ParamGroups(props) {
    const { baseId, groups } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "app_editor_help"]);

    return (
        <FieldArray
            name="groups"
            render={(arrayHelpers) => (
                <>
                    <Card>
                        <CardContent>
                            <Typography component="div">
                                <Trans
                                    t={t}
                                    i18nKey="app_editor_help:Section"
                                    components={{
                                        b: <b />,
                                        p: <p />,
                                    }}
                                />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                id={buildID(baseId, ids.BUTTONS.ADD_GROUP)}
                                color="primary"
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => {
                                    arrayHelpers.unshift({
                                        label: t("newSectionLabel", {
                                            count: groups.length + 1,
                                        }),
                                        isVisible: true,
                                        parameters: [],
                                    });
                                }}
                            >
                                {t("addSection")}
                            </Button>
                        </CardActions>
                    </Card>
                    {groups?.map((group, index) => (
                        <ParamGroupForm
                            key={index}
                            baseId={baseId}
                            fieldName={`groups.${index}`}
                            group={group}
                            onDelete={() => setConfirmDeleteIndex(index)}
                            onMoveUp={() => {
                                if (index > 0) {
                                    arrayHelpers.move(index, index - 1);
                                }
                            }}
                            onMoveDown={() => {
                                if (index < groups.length - 1) {
                                    arrayHelpers.move(index, index + 1);
                                }
                            }}
                        />
                    ))}
                    <ConfirmationDialog
                        baseId={baseId}
                        open={confirmDeleteIndex >= 0}
                        onClose={onCloseDeleteConfirm}
                        onConfirm={() => {
                            arrayHelpers.remove(confirmDeleteIndex);
                            onCloseDeleteConfirm();
                        }}
                        confirmButtonText={t("common:delete")}
                        title={t("confirmDeleteGroupTitle")}
                        contentText={t("confirmDeleteGroupText")}
                    />
                </>
            )}
        />
    );
}

export default ParamGroups;
