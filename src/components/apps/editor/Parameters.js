/**
 * A form component for creating, editing, and deleting App group parameters.
 *
 * @author psarando
 */
import React from "react";

import { FastField, FieldArray } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import ParamSelectionPalette from "./ParamSelectionPalette";

import { DataSources } from "./params/FileOutputPropertyFields";

import { getAppParameterLaunchComponent } from "../utils";

import MultiFileSelector from "components/apps/launch/params/MultiFileSelector";

import AppParamTypes from "components/models/AppParamTypes";
import FileInfoTypes from "components/models/FileInfoTypes";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import { build as buildID } from "@cyverse-de/ui-lib";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
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
        field: { name: fieldName },
        param,
        scrollToField,
        setScrollToField,
        onEdit,
        onDelete,
        onMoveUp,
        onMoveDown,
    } = props;

    const paramEl = React.useRef();
    React.useEffect(() => {
        if (paramEl && scrollToField === fieldName) {
            paramEl.current.scrollIntoView();
            setScrollToField(null);
        }
    }, [fieldName, paramEl, scrollToField, setScrollToField]);

    const { t } = useTranslation("app_editor");
    const classes = useStyles();

    const paramBaseId = buildID(baseId, fieldName);
    const defaultValueFieldName = `${fieldName}.defaultValue`;

    const FieldComponent = getAppParameterLaunchComponent(param.type);
    const fieldProps = {
        disabled: !param.isVisible || FieldComponent === MultiFileSelector,
    };

    return (
        <Card ref={paramEl} className={classes.paramCard}>
            <CardHeader
                title={
                    <FastField
                        id={buildID(baseId, defaultValueFieldName)}
                        name={defaultValueFieldName}
                        param={param}
                        component={FieldComponent}
                        {...fieldProps}
                    />
                }
                action={
                    <ButtonGroup color="primary" variant="text">
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_UP_BTN)}
                            aria-label={t("moveParameterUp")}
                            onClick={onMoveUp}
                        >
                            <ArrowUpward />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.MOVE_DOWN_BTN)}
                            aria-label={t("moveParameterDown")}
                            onClick={onMoveDown}
                        >
                            <ArrowDownward />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.EDIT_BTN)}
                            aria-label={t("editParameterProperties")}
                            onClick={onEdit}
                        >
                            <Edit />
                        </Button>
                        <Button
                            id={buildID(paramBaseId, ids.BUTTONS.DELETE_BTN)}
                            aria-label={t("removeParameter")}
                            className={classes.deleteIcon}
                            onClick={onDelete}
                        >
                            <Delete />
                        </Button>
                    </ButtonGroup>
                }
            />
        </Card>
    );
}

function Parameters(props) {
    const {
        baseId,
        groupFieldName,
        parameters,
        onEditParam,
        scrollToField,
        setScrollToField,
    } = props;

    const [paramSelectOpen, setParamSelectOpen] = React.useState(false);
    const handleAddParamMenuClose = () => setParamSelectOpen(false);

    const [confirmDeleteIndex, setConfirmDeleteIndex] = React.useState(-1);
    const onCloseDeleteConfirm = () => setConfirmDeleteIndex(-1);

    const { t } = useTranslation(["app_editor", "common"]);

    const parametersFieldName = `${groupFieldName}.parameters`;

    return (
        <FieldArray
            name={parametersFieldName}
            render={(arrayHelpers) => {
                const handleAddParam = (paramType) => {
                    const newParamLabel = t("newParamLabel", {
                        count: parameters.length + 1,
                    });

                    const newParam = {
                        type: paramType,
                        label: newParamLabel,
                        description: "",
                        order: 0,
                        isVisible: true,
                    };

                    switch (paramType) {
                        case AppParamTypes.INFO:
                            // Info params don't need any other properties.
                            break;

                        case AppParamTypes.FLAG:
                            newParam.defaultValue = false;
                            newParam.name = {
                                checked: {
                                    option: "",
                                    value: "",
                                },
                                unchecked: {
                                    option: "",
                                    value: "",
                                },
                            };
                            break;

                        case AppParamTypes.TEXT_SELECTION:
                            newParam.arguments = [];
                            newParam.defaultValue = "";
                            newParam.required = false;
                            newParam.omit_if_blank = false;
                            break;

                        case AppParamTypes.FILE_INPUT:
                        case AppParamTypes.FOLDER_INPUT:
                        case AppParamTypes.FOLDER_OUTPUT:
                        case AppParamTypes.MULTIFILE_OUTPUT:
                            newParam.name = "";
                            newParam.defaultValue = "";
                            newParam.required = false;
                            newParam.omit_if_blank = false;
                            newParam.file_parameters = {
                                format: FileInfoTypes.UNSPECIFIED,
                                is_implicit: false,
                            };
                            break;

                        case AppParamTypes.MULTIFILE_SELECTOR:
                            newParam.name = "";
                            newParam.defaultValue = [];
                            newParam.required = false;
                            newParam.omit_if_blank = false;
                            newParam.file_parameters = {
                                format: FileInfoTypes.UNSPECIFIED,
                                is_implicit: false,
                                repeat_option_flag: false,
                            };
                            break;

                        case AppParamTypes.FILE_OUTPUT:
                            newParam.name = "";
                            newParam.defaultValue = "";
                            newParam.required = false;
                            newParam.omit_if_blank = false;
                            newParam.file_parameters = {
                                data_source: DataSources.FILE,
                                format: FileInfoTypes.UNSPECIFIED,
                                is_implicit: false,
                            };
                            break;

                        default:
                            newParam.name = "";
                            newParam.defaultValue = "";
                            newParam.required = false;
                            newParam.omit_if_blank = false;
                            break;
                    }

                    arrayHelpers.unshift(newParam);
                    handleAddParamMenuClose();
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
                                <FastField
                                    key={index}
                                    name={fieldName}
                                    component={ParamCardForm}
                                    baseId={baseId}
                                    param={param}
                                    scrollToField={scrollToField}
                                    setScrollToField={setScrollToField}
                                    onEdit={() => onEditParam(fieldName)}
                                    onDelete={() =>
                                        setConfirmDeleteIndex(index)
                                    }
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
                        <ConfirmationDialog
                            baseId={baseId}
                            open={confirmDeleteIndex >= 0}
                            onClose={onCloseDeleteConfirm}
                            onConfirm={() => {
                                arrayHelpers.remove(confirmDeleteIndex);
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
    );
}

export default Parameters;
