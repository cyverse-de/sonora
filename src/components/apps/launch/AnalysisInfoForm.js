/**
 * @author psarando, sriram
 *
 * An App Launch form for collecting top-level analysis info,
 * such as analysis name, comments, and output folder.
 */
import React from "react";
import { useTranslation } from "i18n";
import { FastField } from "formik";

import ResourceTypes from "components/models/ResourceTypes";

import ids from "./ids";

import InputSelector from "./InputSelector";

import {
    build as buildDebugId,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

const AnalysisInfoForm = ({ formId }) => {
    const { t } = useTranslation("launch");
    return (
        <>
            <FastField
                id={buildDebugId(
                    formId,
                    ids.LAUNCH_ANALYSIS_GROUP,
                    ids.APP_LAUNCH_NAME
                )}
                label={t("analysisName")}
                required={true}
                name="name"
                size="small"
                helperText={t("analysisNameHelp")}
                component={FormTextField}
                inputProps={{ maxLength: 255 }}
            />
            <FastField
                id={buildDebugId(
                    formId,
                    ids.LAUNCH_ANALYSIS_GROUP,
                    ids.APP_LAUNCH_COMMENTS
                )}
                label={t("comments")}
                name="description"
                component={FormMultilineTextField}
            />
            <FastField
                id={buildDebugId(
                    formId,
                    ids.LAUNCH_ANALYSIS_GROUP,
                    ids.APP_LAUNCH_OUTPUT_FOLDER
                )}
                label={t("outputFolder")}
                required={true}
                name="output_dir"
                component={InputSelector}
                acceptedType={ResourceTypes.FOLDER}
            />
        </>
    );
};

export default AnalysisInfoForm;
