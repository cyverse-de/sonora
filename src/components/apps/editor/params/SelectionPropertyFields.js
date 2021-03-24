/**
 * A form component for editing App `TextSelection` parameter properties.
 * Will also be used for `DoubleSelection` and `IntegerSelection` parameters.
 *
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray } from "formik";
import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";

import ids from "../ids";
import styles from "../styles";

import ConfirmationDialog from "components/utils/ConfirmationDialog";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    Grid,
    makeStyles,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";

import { Add, ArrowUpward, ArrowDownward, Delete } from "@material-ui/icons";

const useStyles = makeStyles(styles);

function SelectionItemEditorRow(props) {
    const { baseId, fieldName, onMoveUp, onMoveDown, onDelete } = props;

    const { t } = useTranslation("app_editor");
    const classes = useStyles();

    const baseParamArgId = buildID(baseId, fieldName);

    return (
        <TableRow>
            <TableCell padding="none">
                <FastField
                    id={buildID(baseParamArgId, ids.PARAM_FIELDS.LABEL)}
                    name={`${fieldName}.display`}
                    component={FormTextField}
                />
            </TableCell>
            <TableCell padding="none">
                <FastField
                    id={buildID(
                        baseParamArgId,
                        ids.PARAM_FIELDS.ARGUMENT_OPTION
                    )}
                    name={`${fieldName}.name`}
                    component={FormTextField}
                />
            </TableCell>
            <TableCell padding="none">
                <FastField
                    id={buildID(
                        baseParamArgId,
                        ids.PARAM_FIELDS.ARGUMENT_VALUE
                    )}
                    name={`${fieldName}.value`}
                    component={FormTextField}
                />
            </TableCell>
            <TableCell padding="none">
                <ButtonGroup color="primary" variant="text">
                    <Button
                        id={buildID(baseParamArgId, ids.BUTTONS.MOVE_UP_BTN)}
                        aria-label={t("moveParameterUp")}
                        onClick={onMoveUp}
                    >
                        <ArrowUpward />
                    </Button>
                    <Button
                        id={buildID(baseParamArgId, ids.BUTTONS.MOVE_DOWN_BTN)}
                        aria-label={t("moveParameterDown")}
                        onClick={onMoveDown}
                    >
                        <ArrowDownward />
                    </Button>
                    <Button
                        id={buildID(baseParamArgId, ids.BUTTONS.DELETE_BTN)}
                        aria-label={t("removeParameter")}
                        className={classes.deleteIcon}
                        onClick={onDelete}
                    >
                        <Delete />
                    </Button>
                </ButtonGroup>
            </TableCell>
        </TableRow>
    );
}

function SelectionItemEditor(props) {
    const {
        baseId,
        fieldName,
        paramArguments,
        onAdd,
        onMoveUp,
        onMoveDown,
        onDelete,
    } = props;

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);

    const baseParamId = buildID(baseId, fieldName);

    return (
        <>
            <TableContainer>
                <Table>
                    <Typography component="caption">
                        <Trans
                            t={t}
                            i18nKey="app_editor_help:TextSelectionEditor"
                            components={{
                                p: <p />,
                            }}
                        />
                    </Typography>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("paramArgDisplay")}</TableCell>
                            <TableCell>{t("paramArgName")}</TableCell>
                            <TableCell>{t("paramArgValue")}</TableCell>
                            <TableCell>
                                <Button
                                    id={buildID(
                                        baseParamId,
                                        ids.BUTTONS.ADD_PARAM_ARG
                                    )}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={onAdd}
                                >
                                    {t("common:add")}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paramArguments?.map((paramArg, index) => (
                            <SelectionItemEditorRow
                                key={paramArg.id || index}
                                baseId={baseId}
                                fieldName={`${fieldName}.${index}`}
                                onMoveUp={onMoveUp(index)}
                                onMoveDown={onMoveDown(index)}
                                onDelete={onDelete(index)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default function SelectionPropertyFields(props) {
    const { baseId, fieldName, paramArguments } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "common"]);

    const baseParamId = buildID(baseId, fieldName);

    return (
        <Grid container direction="column">
            <LabelField baseId={baseParamId} fieldName={fieldName} />

            <DefaultValueField
                baseId={baseParamId}
                fieldName={fieldName}
                component={FormTextField}
                select
                variant="outlined"
                margin="normal"
                size="small"
            >
                <MenuItem value="">&nbsp;</MenuItem>
                {paramArguments?.map((paramArg) => (
                    <MenuItem key={paramArg.value} value={paramArg}>
                        {paramArg.display}
                    </MenuItem>
                ))}
            </DefaultValueField>

            <DescriptionField baseId={baseParamId} fieldName={fieldName} />
            <RequiredField baseId={baseParamId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseParamId} fieldName={fieldName} />

            <FieldArray
                name={`${fieldName}.arguments`}
                render={(arrayHelpers) => {
                    const onAdd = () => {
                        arrayHelpers.unshift({
                            display: t("newParamLabel", {
                                type: t("argumentOption"),
                            }),
                            name: "",
                            value: "",
                            isDefault: false,
                        });
                    };

                    const onMoveUp = (index) => () => {
                        if (index > 0) {
                            arrayHelpers.move(index, index - 1);
                        }
                    };

                    const onMoveDown = (index) => () => {
                        if (index < paramArguments.length - 1) {
                            arrayHelpers.move(index, index + 1);
                        }
                    };

                    const onDelete = (index) => () =>
                        setConfirmDeleteIndex(index);

                    const onConfirmDelete = (index) => {
                        arrayHelpers.remove(index);
                    };

                    return (
                        <>
                            <SelectionItemEditor
                                baseId={baseId}
                                fieldName={`${fieldName}.arguments`}
                                paramArguments={paramArguments}
                                onAdd={onAdd}
                                onMoveUp={onMoveUp}
                                onMoveDown={onMoveDown}
                                onDelete={onDelete}
                            />
                            <ConfirmationDialog
                                baseId={baseParamId}
                                open={confirmDeleteIndex >= 0}
                                onClose={onCloseDeleteConfirm}
                                onConfirm={() => {
                                    onConfirmDelete(confirmDeleteIndex);
                                    onCloseDeleteConfirm();
                                }}
                                confirmButtonText={t("common:delete")}
                                title={t("confirmDeleteParamTitle")}
                                contentText={t("confirmDeleteParamText")}
                            />
                        </>
                    );
                }}
            />
        </Grid>
    );
}
