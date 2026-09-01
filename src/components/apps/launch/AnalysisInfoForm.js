/**
 * @author psarando, sriram
 *
 * An App Launch form for collecting top-level analysis info,
 * such as analysis name, comments, output folder, and resource preset selection.
 */
import React from "react";
import { useTranslation } from "i18n";
import { FastField } from "formik";

import ResourceTypes from "components/models/ResourceTypes";

import ids from "./ids";

import InputSelector from "./InputSelector";
import { ResourcePresetPicker } from "./ResourceRequirements";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormMultilineTextField from "components/forms/FormMultilineTextField";

import { Typography } from "@mui/material";

const AnalysisInfoForm = ({
    formId,
    resourcePresets,
    requirements,
    singleStep,
    defaultMaxCPUCores,
    defaultMaxMemory,
    maxTimeLimitSeconds,
    isVICE,
}) => {
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
            {singleStep && resourcePresets?.length > 0 && (
                <>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 2, mb: 0.5 }}
                    >
                        {t("resourcePresetHelp")}
                    </Typography>
                    <ResourcePresetPicker
                        resourcePresets={resourcePresets}
                        requirements={requirements}
                        index={0}
                        defaultMaxCPUCores={defaultMaxCPUCores}
                        defaultMaxMemory={defaultMaxMemory}
                        maxTimeLimitSeconds={maxTimeLimitSeconds}
                        isVICE={isVICE}
                    />
                </>
            )}
        </>
    );
};

export default AnalysisInfoForm;
