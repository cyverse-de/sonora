/**
 * Dropdown for selecting the initial duration of a VICE analysis.
 * Stores the selected value (in seconds, or "" for "use default") as
 * `time_limit_seconds` in Formik state.
 *
 * When `lockedValue` is a number, renders a read-only display instead
 * of the dropdown (used when a resource preset locks the duration).
 */
import React from "react";
import { useTranslation } from "i18n";
import { FastField, useFormikContext } from "formik";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormSelectField from "components/forms/FormSelectField";

import { buildDurationLimitList, formatDuration } from "./formatters";

import { MenuItem } from "@mui/material";

function InitialDurationField({ baseId, maxTimeLimitSeconds, lockedValue }) {
    const { t } = useTranslation("launch");
    const { values } = useFormikContext();

    if (typeof lockedValue === "number") {
        return (
            <FormTextField
                field={{ name: "time_limit_seconds", value: "" }}
                form={{ touched: {}, errors: {} }}
                id={buildID(baseId, ids.RESOURCE_REQUESTS.INITIAL_DURATION)}
                label={t("initialDuration")}
                value={formatDuration(lockedValue)}
                disabled
            />
        );
    }

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

export default InitialDurationField;
