/**
 * @author psarando, sriram
 *
 * An App Launch form for collecting top-level analysis info,
 * such as analysis name, comments, and output folder.
 */
import React from "react";
import { useTranslation } from "i18n";
import { FastField, useFormikContext } from "formik";

import ResourceTypes from "components/models/ResourceTypes";
import TOOL_TYPES from "components/models/ToolTypes";

import ids from "./ids";

import InputSelector from "./InputSelector";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import FormSelectField from "components/forms/FormSelectField";

import { buildDurationLimitList, formatDuration } from "./formatters";

import { MenuItem } from "@mui/material";

/**
 * Dropdown for selecting the initial duration of a VICE analysis.
 * Stores the selected value (in seconds, or "" for "use default") as
 * `time_limit_seconds` in Formik state.
 */
function InitialDurationField({ baseId, maxTimeLimitSeconds }) {
    const { t } = useTranslation("launch");
    const { values } = useFormikContext();

    const options = buildDurationLimitList(maxTimeLimitSeconds);

    // Include the current value as an option on relaunch, in case it exceeds
    // the standard ladder of options (e.g. an extended running analysis).
    const current = values.time_limit_seconds;
    if (
        typeof current === "number" &&
        current > 0 &&
        current <= maxTimeLimitSeconds &&
        !options.includes(current)
    ) {
        options.push(current);
    }

    return (
        <FastField
            id={buildID(baseId, ids.RESOURCE_REQUESTS.INITIAL_DURATION)}
            name="time_limit_seconds"
            label={t("initialDuration")}
            helperText={t("initialDurationHelp")}
            component={FormSelectField}
        >
            <MenuItem key="initialDurationDefault" value="">
                {t("initialDurationDefault")}
            </MenuItem>
            {options.map((value) => (
                <MenuItem key={value} value={value}>
                    {formatDuration(value)}
                </MenuItem>
            ))}
        </FastField>
    );
}

const AnalysisInfoForm = ({ formId, overallJobType, maxTimeLimitSeconds }) => {
    const { t } = useTranslation("launch");
    const isVICE = overallJobType === TOOL_TYPES.INTERACTIVE;

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
            {isVICE && maxTimeLimitSeconds && (
                <InitialDurationField
                    baseId={buildID(formId, ids.LAUNCH_ANALYSIS_GROUP)}
                    maxTimeLimitSeconds={maxTimeLimitSeconds}
                />
            )}
        </>
    );
};

export default AnalysisInfoForm;
