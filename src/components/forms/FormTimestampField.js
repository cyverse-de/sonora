/**
 * @author psarando
 */
import React from "react";

import buildID from "../utils/DebugIDUtil";
import { formatDateObject } from "../utils/DateFormatter";
import dateConstants from "components/utils/dateConstants";

import getFormError from "./getFormError";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

const onDateChange = (prevDate, fieldName, setFieldValue) => (event) => {
    const newValue = event.target.value;
    if (newValue) {
        const date = prevDate ? prevDate : new Date();
        const time = formatDateObject(date, dateConstants.TIME_FORMAT);

        setFieldValue(fieldName, `${newValue} ${time}`);
    } else {
        setFieldValue(fieldName, "");
    }
};

const onTimeChange = (prevDate, fieldName, setFieldValue) => (event) => {
    const newValue = event.target.value;
    if (newValue) {
        const date = prevDate ? prevDate : new Date();
        const dateStr = formatDateObject(date, dateConstants.DATE_FORMAT);

        setFieldValue(fieldName, `${dateStr} ${newValue}`);
    } else {
        setFieldValue(fieldName, "");
    }
};

const FormTimestampField = ({
    id,
    label,
    helperText,
    required,
    field: { value, onChange, ...field },
    form: { touched, errors, setFieldValue },
    ...custom
}) => {
    const errorMsg = getFormError(field.name, touched, errors);
    const date = value && Date.parse(value);

    return (
        <FormControl error={!!errorMsg}>
            <TextField
                id={buildID(id, "date")}
                type="date"
                variant="outlined"
                label={label}
                error={!!errorMsg}
                required={required}
                value={
                    date
                        ? formatDateObject(date, dateConstants.DATE_FORMAT)
                        : ""
                }
                onChange={onDateChange(date, field.name, setFieldValue)}
                {...field}
                {...custom}
            />
            <TextField
                id={buildID(id, "time")}
                type="time"
                variant="outlined"
                error={!!errorMsg}
                required={required}
                value={
                    date
                        ? formatDateObject(date, dateConstants.TIME_FORMAT)
                        : ""
                }
                onChange={onTimeChange(date, field.name, setFieldValue)}
                {...field}
                {...custom}
            />
            <FormHelperText>{errorMsg || helperText}</FormHelperText>
        </FormControl>
    );
};

export default FormTimestampField;
