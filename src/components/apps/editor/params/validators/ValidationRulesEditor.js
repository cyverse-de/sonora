/**
 * Form fields for adding, editing, and deleting App parameter validator rules.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { Trans, useTranslation } from "i18n";

import ids from "../../ids";
import styles from "../../styles";

import CharacterLimitField from "./CharacterLimitField";
import DoubleAboveField from "./DoubleAboveField";
import DoubleBelowField from "./DoubleBelowField";
import DoubleRangeField from "./DoubleRangeField";
import IntAboveField from "./IntAboveField";
import IntBelowField from "./IntBelowField";
import IntRangeField from "./IntRangeField";
import RegexField from "./RegexField";

import { ValidatorTypes } from "components/models/AppParamTypes";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import {
    Button,
    ListItemText,
    Menu,
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

import { Add, Delete } from "@mui/icons-material";

const useStyles = makeStyles()(styles);

function ValidationRulesEditorRow(props) {
    const { baseId, cosmeticOnly, fieldName, ruleType, onDelete } = props;

    const { t } = useTranslation(["app_editor", "common"]);
    const { classes } = useStyles();

    let RuleParamComponent, ruleDisplay;

    switch (ruleType) {
        case ValidatorTypes.CHARACTER_LIMIT:
            ruleDisplay = t("validationRuleCharacterLimit");
            RuleParamComponent = CharacterLimitField;
            break;

        case ValidatorTypes.DOUBLE_ABOVE:
            ruleDisplay = t("validationRuleValueAbove");
            RuleParamComponent = DoubleAboveField;
            break;

        case ValidatorTypes.DOUBLE_BELOW:
            ruleDisplay = t("validationRuleValueBelow");
            RuleParamComponent = DoubleBelowField;
            break;

        case ValidatorTypes.DOUBLE_RANGE:
            ruleDisplay = t("validationRuleValueRange");
            RuleParamComponent = DoubleRangeField;
            break;

        case ValidatorTypes.INT_ABOVE:
            ruleDisplay = t("validationRuleValueAbove");
            RuleParamComponent = IntAboveField;
            break;

        case ValidatorTypes.INT_BELOW:
            ruleDisplay = t("validationRuleValueBelow");
            RuleParamComponent = IntBelowField;
            break;

        case ValidatorTypes.INT_RANGE:
            ruleDisplay = t("validationRuleValueRange");
            RuleParamComponent = IntRangeField;
            break;

        case ValidatorTypes.REGEX:
            ruleDisplay = t("validationRuleRegex");
            RuleParamComponent = RegexField;
            break;

        default:
            ruleDisplay = "";
            RuleParamComponent = (
                <FastField
                    id={buildID(
                        baseId,
                        "params",
                        ids.PARAM_FIELDS.ARGUMENT_OPTION
                    )}
                    name={`${fieldName}.params.0`}
                    component={FormTextField}
                />
            );
            break;
    }

    return (
        <TableRow>
            <TableCell padding="none">
                <Typography>{ruleDisplay}</Typography>
            </TableCell>
            <TableCell padding="none">
                <RuleParamComponent
                    baseId={buildID(baseId, "params")}
                    fieldName={fieldName}
                    disabled={cosmeticOnly}
                />
            </TableCell>
            {!cosmeticOnly && (
                <TableCell padding="none">
                    <Button
                        id={buildID(baseId, ids.BUTTONS.DELETE_BTN)}
                        aria-label={t("common:delete")}
                        className={classes.deleteIcon}
                        onClick={onDelete}
                    >
                        <Delete />
                    </Button>
                </TableCell>
            )}
        </TableRow>
    );
}

function ValidationRulesEditor(props) {
    const {
        baseId,
        cosmeticOnly,
        fieldName,
        validators,
        ruleOptions,
        onAdd,
        onConfirmDelete,
    } = props;

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const onDelete = (index) => () => setConfirmDeleteIndex(index);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleAddRuleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseRuleMenu = () => {
        setAnchorEl(null);
    };
    const { t } = useTranslation([
        "app_editor",
        "app_editor_help",
        "app_param_types",
        "common",
    ]);

    const validatorRulesMenuId = buildID(
        baseId,
        ids.PARAM_FIELDS.VALIDATOR_RULES_MENU
    );

    return (
        <>
            <TableContainer>
                <Table>
                    <Typography component="caption">
                        <Trans
                            t={t}
                            i18nKey="app_editor_help:validationRules"
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
                            {!cosmeticOnly && (
                                <TableCell>
                                    <Button
                                        id={buildID(
                                            baseId,
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
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validators?.map((rule, index) => (
                            <ValidationRulesEditorRow
                                key={index}
                                baseId={buildID(baseId, index)}
                                cosmeticOnly={cosmeticOnly}
                                fieldName={`${fieldName}.${index}`}
                                ruleType={rule.type}
                                onDelete={onDelete(index)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                id={validatorRulesMenuId}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseRuleMenu}
            >
                {ruleOptions.map((type) => (
                    <MenuItem
                        key={type}
                        id={buildID(validatorRulesMenuId, type)}
                        onClick={() => {
                            onAdd(type);
                            handleCloseRuleMenu();
                        }}
                    >
                        <ListItemText
                            primary={t(`app_param_types:${type}`)}
                            secondary={t(`app_editor_help:${type}`)}
                        />
                    </MenuItem>
                ))}
            </Menu>

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
}

export default ValidationRulesEditor;
