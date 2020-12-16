/**
 * A form component for creating, editing, and deleting App group parameters.
 *
 * @author psarando
 */
import React from "react";

import { Field, FieldArray } from "formik";
import sanitizeHtml from "sanitize-html";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import ParamSelectionPalette from "./ParamSelectionPalette";

import constants from "components/apps/launch/constants";

import {
    build as buildID,
    FormTextField,
    FormMultilineTextField,
} from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Typography,
    makeStyles,
} from "@material-ui/core";

import {
    Add,
    Delete,
    Edit,
    ArrowDownward,
    ArrowUpward,
} from "@material-ui/icons";

const useStyles = makeStyles(styles);

function ParamCardForm(props) {
    const {
        baseId,
        fieldName,
        param,
        onEdit,
        onDelete,
        onMoveUp,
        onMoveDown,
    } = props;

    const { t } = useTranslation(["app_param_types", "app_editor"]);
    const classes = useStyles();

    const paramBaseId = buildID(baseId, fieldName);
    const defaultValueFieldName = `${fieldName}.defaultValue`;

    let fieldProps = {
        id: buildID(baseId, defaultValueFieldName),
        name: defaultValueFieldName,
        label: param.label,
        helperText: param.description,
        required: param.required,
        margin: "normal",
    };

    switch (param.type) {
        case constants.PARAM_TYPE.INFO:
            fieldProps = {
                id: fieldProps.id,
                name: fieldProps.name,
                component: Typography,
                variant: "body1",
                gutterBottom: true,
                dangerouslySetInnerHTML: {
                    __html: sanitizeHtml(param.label),
                },
            };

            break;

        case constants.PARAM_TYPE.TEXT:
            fieldProps.component = FormTextField;
            fieldProps.size = "small";
            if (param.validators?.length > 0) {
                const charLimitValidator = param.validators.find(
                    (validator) =>
                        validator.type ===
                        constants.VALIDATOR_TYPE.CHARACTER_LIMIT
                );
                if (charLimitValidator) {
                    fieldProps.inputProps = {
                        maxLength: charLimitValidator.params[0],
                    };
                }
            }
            break;

        case constants.PARAM_TYPE.MULTILINE_TEXT:
            fieldProps.component = FormMultilineTextField;
            fieldProps.size = "small";
            break;

        default:
            fieldProps.component = FormTextField;
            break;
    }

    const cardTitle = fieldProps.label
        ? `${t(param.type)}: ${fieldProps.label}`
        : t(param.type);

    return (
        <Card className={classes.paramCard}>
            <CardHeader
                title={cardTitle}
                action={
                    <ButtonGroup color="primary" variant="text">
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("app_editor:moveParameterUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            aria-label={t("app_editor:moveParameterDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.EDIT_BTN)}
                            aria-label={t("app_editor:editParameterProperties")}
                            onClick={onEdit}
                        >
                            <Edit />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.DELETE_BTN)}
                            aria-label={t("app_editor:removeParameter")}
                            className={classes.deleteIcon}
                            onClick={onDelete}
                        >
                            <Delete />
                        </Button>
                    </ButtonGroup>
                }
            />
            <CardContent>
                <Field {...fieldProps} />
            </CardContent>
        </Card>
    );
}

function Parameters(props) {
    const { baseId, groupFieldName, parameters, setEditingParamMap } = props;

    const [paramSelectOpen, setParamSelectOpen] = React.useState(false);
    const handleAddParamMenuClose = () => setParamSelectOpen(false);

    const { t } = useTranslation("app_editor");

    const parametersFieldName = `${groupFieldName}.parameters`;

    return (
        <FieldArray
            name={parametersFieldName}
            render={(arrayHelpers) => {
                const handleAddParam = (paramType) => {
                    const param = {
                        type: paramType,
                        label: "",
                        name: "",
                        description: "",
                        defaultValue: "",
                        required: false,
                        isVisible: true,
                        omit_if_blank: false,
                    };

                    arrayHelpers.unshift(param);
                    handleAddParamMenuClose();
                    setEditingParamMap({
                        param,
                        fieldName: `${parametersFieldName}.0`,
                    });
                };

                return (
                    <>
                        <ParamSelectionPalette
                            baseId={buildID(baseId, ids.PARAM_TYPE_LIST)}
                            open={paramSelectOpen}
                            onClose={handleAddParamMenuClose}
                            handleAddParam={handleAddParam}
                        />
                        <Button
                            id={buildID(baseId, ids.BUTTONS.ADD_PARAM)}
                            color="primary"
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => {
                                setParamSelectOpen(true);
                            }}
                        >
                            {t("addParameter")}
                        </Button>
                        {parameters?.map((param, index) => {
                            const fieldName = `${parametersFieldName}.${index}`;
                            return (
                                <ParamCardForm
                                    key={index}
                                    baseId={baseId}
                                    fieldName={fieldName}
                                    param={param}
                                    onEdit={() =>
                                        setEditingParamMap({
                                            param,
                                            fieldName,
                                        })
                                    }
                                    // FIXME: add confirmation dialog
                                    onDelete={() => arrayHelpers.remove(index)}
                                    onMoveUp={() => {
                                        if (index > 0) {
                                            arrayHelpers.move(index, index - 1);
                                        }
                                    }}
                                    onMoveDown={() => {
                                        if (index < parameters.length - 1) {
                                            arrayHelpers.move(index, index + 1);
                                        }
                                    }}
                                />
                            );
                        })}
                    </>
                );
            }}
        />
    );
}

export default Parameters;
