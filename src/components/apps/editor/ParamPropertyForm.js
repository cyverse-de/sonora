/**
 * A form component for editing App parameter properties.
 *
 * @author psarando
 */
import React from "react";

import { Field, getIn } from "formik";

import { useTranslation } from "i18n";

import ids from "./ids";

import CheckboxPropertyFields from "./params/CheckboxPropertyFields";
import DoublePropertyFields from "./params/DoublePropertyFields";
import EnvironmentVariablePropertyFields from "./params/EnvironmentVariablePropertyFields";
import FileInputPropertyFields from "./params/FileInputPropertyFields";
import FileOutputPropertyFields from "./params/FileOutputPropertyFields";
import FolderInputPropertyFields from "./params/FolderInputPropertyFields";
import FolderOutputPropertyFields from "./params/FolderOutputPropertyFields";
import InfoTextField from "./params/InfoTextField";
import IntegerPropertyFields from "./params/IntegerPropertyFields";
import MultiFileOutputPropertyFields from "./params/MultiFileOutputPropertyFields";
import MultiFileSelectorPropertyFields from "./params/MultiFileSelectorPropertyFields";
import MultiLineTextPropertyFields from "./params/MultiLineTextPropertyFields";
import ReferenceGenomePropertyFields from "./params/ReferenceGenomePropertyFields";
import SelectionPropertyFields from "./params/SelectionPropertyFields";
import TextPropertyFields from "./params/TextPropertyFields";

import { getAppParameterLaunchComponent } from "../utils";

import Info from "components/apps/launch/params/Info";
import MultiFileSelector from "components/apps/launch/params/MultiFileSelector";

import AppParamTypes from "components/models/AppParamTypes";

import { build as buildID } from "@cyverse-de/ui-lib";

import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
} from "@material-ui/core";

function ParamPreview(props) {
    const { baseId, cosmeticOnly, fieldName, param } = props;

    const defaultValueFieldName = `${fieldName}.defaultValue`;

    const FieldComponent = getAppParameterLaunchComponent(param.type);
    const fieldProps = {
        disabled:
            FieldComponent === MultiFileSelector ||
            (cosmeticOnly && FieldComponent !== Info),
    };

    return (
        <Field
            id={buildID(baseId, defaultValueFieldName)}
            name={defaultValueFieldName}
            param={param}
            component={FieldComponent}
            {...fieldProps}
        />
    );
}

function PropertyFormFields(props) {
    const { baseId, cosmeticOnly, fieldName, param } = props;

    const baseParamId = buildID(baseId, fieldName);

    switch (param?.type) {
        case AppParamTypes.INFO:
            return <InfoTextField baseId={baseParamId} fieldName={fieldName} />;

        case AppParamTypes.MULTILINE_TEXT:
            return (
                <MultiLineTextPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.INTEGER:
            return (
                <IntegerPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    param={param}
                />
            );

        case AppParamTypes.DOUBLE:
            return (
                <DoublePropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    param={param}
                />
            );

        case AppParamTypes.FLAG:
            return (
                <CheckboxPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.ENV_VAR:
            return (
                <EnvironmentVariablePropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
            return (
                <SelectionPropertyFields
                    baseId={baseId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    paramArguments={param.arguments}
                />
            );

        case AppParamTypes.FILE_INPUT:
            return (
                <FileInputPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.FOLDER_INPUT:
            return (
                <FolderInputPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.MULTIFILE_SELECTOR:
            return (
                <MultiFileSelectorPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.FILE_OUTPUT:
            return (
                <FileOutputPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.FOLDER_OUTPUT:
            return (
                <FolderOutputPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.MULTIFILE_OUTPUT:
            return (
                <MultiFileOutputPropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                />
            );

        case AppParamTypes.REFERENCE_ANNOTATION:
        case AppParamTypes.REFERENCE_GENOME:
        case AppParamTypes.REFERENCE_SEQUENCE:
            return (
                <ReferenceGenomePropertyFields
                    baseId={baseParamId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    param={param}
                />
            );

        default:
            return (
                <TextPropertyFields
                    baseId={baseParamId}
                    fieldName={fieldName}
                    cosmeticOnly={cosmeticOnly}
                    param={param}
                />
            );
    }
}

function ParamPropertyForm(props) {
    const { baseId, cosmeticOnly, values, fieldName, onClose } = props;

    const { t } = useTranslation(["app_editor", "app_param_types", "common"]);

    const param = getIn(values, fieldName);

    const doneBtn = (
        <Button
            id={buildID(baseId, ids.BUTTONS.CLOSE_BTN)}
            fullWidth
            color="primary"
            variant="contained"
            onClick={onClose}
        >
            {t("common:done")}
        </Button>
    );

    return (
        <Card id={baseId}>
            <CardHeader title={t("editParameter")} action={doneBtn} />
            <CardHeader
                title={t("previewParameter", {
                    type: t(`app_param_types:${param?.type}`),
                })}
                titleTypographyProps={{
                    variant: "subtitle2",
                }}
            />
            <CardContent>
                <ParamPreview
                    baseId={baseId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    param={param}
                />
            </CardContent>

            <CardHeader
                title={t("configureProperties")}
                titleTypographyProps={{
                    variant: "subtitle2",
                }}
            />
            <CardContent>
                <PropertyFormFields
                    baseId={baseId}
                    cosmeticOnly={cosmeticOnly}
                    fieldName={fieldName}
                    param={param}
                />
            </CardContent>
            <CardActions>{doneBtn}</CardActions>
        </Card>
    );
}

export default ParamPropertyForm;
