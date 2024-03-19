/**
 * A form component for editing App `TextSelection` parameter properties.
 * Will also be used for `DoubleSelection` and `IntegerSelection` parameters.
 *
 * @author psarando
 */
import React from "react";

import { FastField, Field, FieldArray } from "formik";

import { Trans, useTranslation } from "i18n";

import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";

import ids from "../ids";
import styles from "../styles";

import ConfirmationDialog from "components/utils/ConfirmationDialog";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import {
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { Add, ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";

const useStyles = makeStyles()(styles);

function SelectionItemEditorRow(props) {
    const { baseId, cosmeticOnly, fieldName, onMoveUp, onMoveDown, onDelete } =
        props;

    const { t } = useTranslation("common");
    const { classes } = useStyles();

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
                    disabled={cosmeticOnly}
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
                    disabled={cosmeticOnly}
                />
            </TableCell>
            {!cosmeticOnly && (
                <TableCell padding="none">
                    <ButtonGroup color="primary" variant="text">
                        <Button
                            id={buildID(
                                baseParamArgId,
                                ids.BUTTONS.MOVE_UP_BTN
                            )}
                            aria-label={t("moveUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                        <Button
                            id={buildID(
                                baseParamArgId,
                                ids.BUTTONS.MOVE_DOWN_BTN
                            )}
                            aria-label={t("moveDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                        <Button
                            id={buildID(baseParamArgId, ids.BUTTONS.DELETE_BTN)}
                            aria-label={t("delete")}
                            className={classes.deleteIcon}
                            onClick={onDelete}
                        >
                            <Delete />
                        </Button>
                    </ButtonGroup>
                </TableCell>
            )}
        </TableRow>
    );
}

function SelectionItemEditor(props) {
    const {
        baseId,
        cosmeticOnly,
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
                        {!cosmeticOnly && (
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
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paramArguments?.map((paramArg, index) => (
                        <SelectionItemEditorRow
                            key={paramArg.id || index}
                            baseId={baseId}
                            cosmeticOnly={cosmeticOnly}
                            fieldName={`${fieldName}.${index}`}
                            onMoveUp={onMoveUp(index)}
                            onMoveDown={onMoveDown(index)}
                            onDelete={onDelete(index)}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function SelectionDefaultValueEditor({ paramArguments, ...props }) {
    // These props need to be spread into FormTextField below.
    const {
        field: { name, value },
        form: { setFieldValue },
    } = props;

    // Not sure if this is the best place to do this default value check/reset,
    // but it should happen somewhere in the SelectionPropertyFields editor,
    // and this default value editor gets easy access to formik's setFieldValue.
    React.useEffect(() => {
        const foundDefault =
            paramArguments?.find((paramArg) => paramArg.key === value?.key) ||
            "";

        if (foundDefault !== value) {
            setFieldValue(name, foundDefault);
        }
    }, [paramArguments, name, value, setFieldValue]);

    return (
        <FormTextField
            select
            variant="outlined"
            margin="normal"
            size="small"
            {...props}
        >
            <MenuItem value="">&nbsp;</MenuItem>
            {paramArguments?.map((paramArg) => (
                <MenuItem key={paramArg.key} value={paramArg}>
                    {paramArg.display}
                </MenuItem>
            ))}
        </FormTextField>
    );
}

export default function SelectionPropertyFields(props) {
    const {
        baseId,
        cosmeticOnly,
        keyCount,
        setKeyCount,
        fieldName,
        paramArguments,
    } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);

    const baseParamId = buildID(baseId, fieldName);

    return (
        <Grid container direction="column">
            <LabelField baseId={baseParamId} fieldName={fieldName} />

            <Field
                component={SelectionDefaultValueEditor}
                id={buildID(baseParamId, ids.PARAM_FIELDS.DEFAULT_VALUE)}
                name={`${fieldName}.defaultValue`}
                label={t("defaultValue")}
                helperText={t("app_editor_help:DefaultValue")}
                disabled={cosmeticOnly}
                paramArguments={paramArguments}
            />

            <DescriptionField baseId={baseParamId} fieldName={fieldName} />

            <RequiredField
                baseId={baseParamId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />
            <ExcludeArgumentField
                baseId={baseParamId}
                fieldName={fieldName}
                disabled={cosmeticOnly}
            />

            <FieldArray
                name={`${fieldName}.arguments`}
                render={(arrayHelpers) => {
                    const onAdd = () => {
                        arrayHelpers.unshift({
                            key: keyCount,
                            display: t("newParamLabel", {
                                type: t("argumentOption"),
                            }),
                            name: "",
                            value: "",
                            isDefault: false,
                        });

                        setKeyCount(keyCount + 1);
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
                                cosmeticOnly={cosmeticOnly}
                                fieldName={`${fieldName}.arguments`}
                                paramArguments={paramArguments}
                                onAdd={onAdd}
                                onMoveUp={onMoveUp}
                                onMoveDown={onMoveDown}
                                onDelete={onDelete}
                            />
                            <ConfirmationDialog
                                baseId={ids.DELETE_CONFIRM_DIALOG}
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
