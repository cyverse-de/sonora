/**
 * A form component for editing App `Text` parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray } from "formik";
import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import ArgumentOptionField from "./common/ArgumentOptionField";
import DefaultValueField from "./common/DefaultValueField";
import DescriptionField from "./common/DescriptionField";
import ExcludeArgumentField from "./common/ExcludeArgumentField";
import LabelField from "./common/LabelField";
import RequiredField from "./common/RequiredField";
import VisibleField from "./common/VisibleField";

import ids from "../ids";
import styles from "../styles";

import { getTextFieldInputProps } from "components/apps/launch/params/Text";
import { ValidatorTypes } from "components/models/AppParamTypes";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import {
    build as buildID,
    FormTextField,
    FormIntegerField,
} from "@cyverse-de/ui-lib";

import {
    Button,
    Grid,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";

import { Add, Delete } from "@material-ui/icons";

const useStyles = makeStyles(styles);

function ValidationRulesEditorRow(props) {
    const { baseId, fieldName, rule, onDelete } = props;

    const { t } = useTranslation("app_editor");
    const classes = useStyles();

    const baseParamArgId = buildID(baseId, fieldName);

    let RuleParamComponent = FormTextField;

    let ruleDisplay = "";

    if (rule.type === ValidatorTypes.CHARACTER_LIMIT) {
        ruleDisplay = t("validationRuleCharacterLimit");
        RuleParamComponent = FormIntegerField;
    } else if (rule.type === ValidatorTypes.REGEX) {
        ruleDisplay = t("validationRuleRegex");
    }

    return (
        <TableRow>
            <TableCell padding="none">
                <Typography>{ruleDisplay}</Typography>
            </TableCell>
            <TableCell padding="none">
                <FastField
                    id={buildID(
                        baseParamArgId,
                        ids.PARAM_FIELDS.ARGUMENT_OPTION
                    )}
                    name={`${fieldName}.params.0`}
                    component={RuleParamComponent}
                />
            </TableCell>
            <TableCell padding="none">
                <Button
                    id={buildID(baseParamArgId, ids.BUTTONS.DELETE_BTN)}
                    aria-label={t("removeParameter")}
                    className={classes.deleteIcon}
                    onClick={onDelete}
                >
                    <Delete />
                </Button>
            </TableCell>
        </TableRow>
    );
}

function ValidationRulesEditor(props) {
    const { baseId, fieldName, validators, onAdd, onDelete } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleAddRuleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseRuleMenu = () => {
        setAnchorEl(null);
    };
    const { t } = useTranslation(["app_editor", "app_editor_help", "common"]);

    const baseParamId = buildID(baseId, fieldName);

    return (
        <>
            <TableContainer>
                <Table>
                    <Typography component="caption">
                        <Trans
                            t={t}
                            i18nKey="app_editor_help:TextInputValidationRules"
                            components={{
                                p: <p />,
                                b: <b />,
                            }}
                        />
                    </Typography>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography>{t("validationRules")}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{t("validatorParams")}</Typography>
                            </TableCell>
                            <TableCell>
                                <Button
                                    id={buildID(
                                        baseParamId,
                                        ids.BUTTONS.ADD_PARAM_ARG
                                    )}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddRuleClick}
                                >
                                    {t("common:add")}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validators?.map((rule, index) => (
                            <ValidationRulesEditorRow
                                key={index}
                                baseId={baseId}
                                fieldName={`${fieldName}.${index}`}
                                rule={rule}
                                onDelete={onDelete(index)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseRuleMenu}
            >
                <MenuItem
                    onClick={() => {
                        onAdd(ValidatorTypes.REGEX);
                        handleCloseRuleMenu();
                    }}
                >
                    <ListItemText
                        primary={ValidatorTypes.REGEX}
                        secondary={t(
                            "app_editor_help:TextInputValidationRuleRegex"
                        )}
                    />
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onAdd(ValidatorTypes.CHARACTER_LIMIT);
                        handleCloseRuleMenu();
                    }}
                >
                    <ListItemText
                        primary={ValidatorTypes.CHARACTER_LIMIT}
                        secondary={t(
                            "app_editor_help:TextInputValidationRuleCharLimit"
                        )}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}

export default function TextPropertyFields(props) {
    const { baseId, fieldName, param } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "common"]);

    const validatorsFieldName = `${fieldName}.validators`;

    return (
        <Grid container direction="column">
            <LabelField baseId={baseId} fieldName={fieldName} />
            <ArgumentOptionField baseId={baseId} fieldName={fieldName} />
            <DefaultValueField
                baseId={baseId}
                fieldName={fieldName}
                component={FormTextField}
                inputProps={getTextFieldInputProps(param)}
            />
            <DescriptionField baseId={baseId} fieldName={fieldName} />
            <RequiredField baseId={baseId} fieldName={fieldName} />
            <VisibleField baseId={baseId} fieldName={fieldName} />
            <ExcludeArgumentField baseId={baseId} fieldName={fieldName} />

            <FieldArray
                name={validatorsFieldName}
                render={(arrayHelpers) => {
                    const onAdd = (type) => {
                        arrayHelpers.unshift({
                            type,
                            params: [""],
                        });
                    };

                    const onDelete = (index) => () =>
                        setConfirmDeleteIndex(index);

                    const onConfirmDelete = (index) => {
                        arrayHelpers.remove(index);
                    };

                    return (
                        <>
                            <ValidationRulesEditor
                                baseId={baseId}
                                fieldName={validatorsFieldName}
                                validators={param.validators}
                                onAdd={onAdd}
                                onDelete={onDelete}
                            />
                            <ConfirmationDialog
                                baseId={baseId}
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
