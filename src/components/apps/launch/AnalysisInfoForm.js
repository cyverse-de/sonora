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

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormMultilineTextField from "components/forms/FormMultilineTextField";

const AnalysisInfoForm = ({ formId }) => {
    const { t } = useTranslation("launch");
    return (
        <>
            <FastField
                id={buildID(
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
                id={buildID(
                    formId,
                    ids.LAUNCH_ANALYSIS_GROUP,
                    ids.APP_LAUNCH_COMMENTS
                )}
                label={t("comments")}
                name="description"
                component={FormMultilineTextField}
            />
            <FastField
                id={buildID(
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
