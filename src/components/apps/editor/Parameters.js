/**
 * A form component for creating, editing, and deleting App group parameters.
 *
 * @author psarando
 */
import React from "react";

import { FastField, Field, FieldArray } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";

import ParamPropertyForm from "./ParamPropertyForm";
import ParamSelectionPalette from "./ParamSelectionPalette";

import Checkbox from "components/apps/launch/params/Checkbox";
import Double from "components/apps/launch/params/Double";
import FileFolderInput from "components/apps/launch/params/FileFolderInput";
import FileInput from "components/apps/launch/params/FileInput";
import FolderInput from "components/apps/launch/params/FolderInput";
import Info from "components/apps/launch/params/Info";
import Integer from "components/apps/launch/params/Integer";
import MultiFileSelector from "components/apps/launch/params/MultiFileSelector";
import MultilineText from "components/apps/launch/params/MultilineText";
import Selection from "components/apps/launch/params/Selection";
import Text from "components/apps/launch/params/Text";
import AppParamTypes from "components/models/AppParamTypes";
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
        onDelete,
        onMoveUp,
        onMoveDown,
    } = props;

    const [propertyDialogOpen, setPropertyDialogOpen] = React.useState(false);
    const onPropertyDialogClose = () => setPropertyDialogOpen(false);

    const { t } = useTranslation("app_editor");
    const classes = useStyles();

    const paramBaseId = buildID(baseId, fieldName);
    const defaultValueFieldName = `${fieldName}.defaultValue`;

    let fieldComponent;

    switch (param.type) {
        case AppParamTypes.INFO:
            fieldComponent = Info;

            break;

        case AppParamTypes.TEXT:
            fieldComponent = Text;
            break;

        case AppParamTypes.MULTILINE_TEXT:
            fieldComponent = MultilineText;
            break;

        case AppParamTypes.INTEGER:
            fieldComponent = Integer;
            break;

        case AppParamTypes.DOUBLE:
            fieldComponent = Double;
            break;

        case AppParamTypes.FLAG:
            fieldComponent = Checkbox;
            break;

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
            fieldComponent = Selection;
            break;

        case AppParamTypes.FILE_INPUT:
            fieldComponent = FileInput;
            break;

        case AppParamTypes.FOLDER_INPUT:
            fieldComponent = FolderInput;
            break;

        case AppParamTypes.FILE_FOLDER_INPUT:
            fieldComponent = FileFolderInput;
            break;

        case AppParamTypes.MULTIFILE_SELECTOR:
            fieldComponent = MultiFileSelector;
            break;

        default:
            fieldComponent = Text;
            break;
    }

    return (
        <Card className={classes.paramCard}>
            <CardHeader
                title={
                    <Field
                        id={buildID(baseId, defaultValueFieldName)}
                        name={defaultValueFieldName}
                        param={param}
                        component={fieldComponent}
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
                            onClick={() => setPropertyDialogOpen(true)}
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
            <ParamPropertyForm
                baseId={buildID(baseId, ids.PROPERTY_EDITOR)}
                open={propertyDialogOpen}
                onClose={onPropertyDialogClose}
                fieldName={fieldName}
                param={param}
            />
        </Card>
    );
}

function Parameters(props) {
    const { baseId, groupFieldName, parameters } = props;

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
                    let name = "";
                    let defaultValue = "";

                    if (paramType === AppParamTypes.FLAG) {
                        defaultValue = false;
                        name = {
                            checked: {
                                option: "",
                                value: "",
                            },
                            unchecked: {
                                option: "",
                                value: "",
                            },
                        };
                    }

                    const newParamLabel = t("newParamLabel", {
                        count: parameters.length + 1,
                    });

                    arrayHelpers.unshift({
                        type: paramType,
                        label: newParamLabel,
                        name,
                        description: "",
                        defaultValue,
                        required: false,
                        isVisible: true,
                        omit_if_blank: false,
                    });
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
