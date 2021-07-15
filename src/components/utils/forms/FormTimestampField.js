/**
 * @author psarando
 */
import React from "react";

import build from "../DebugIDUtil";
import { formatDateObject } from "../DateFormatter";
import dateConstants from "../../dateConstants";

import getFormError from "./getFormError";

import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

const onDateChange = (prevDate, fieldName, setFieldValue) => (event) => {
    const newValue = event.target.value;
    const date = prevDate ? prevDate : new Date();
    const time = formatDateObject(date, dateConstants.TIME_FORMAT);

    setFieldValue(fieldName, `${newValue} ${time}`);
};

const onTimeChange = (prevDate, fieldName, setFieldValue) => (event) => {
    const newValue = event.target.value;
    const date = prevDate ? prevDate : new Date();
    const dateStr = formatDateObject(date, dateConstants.DATE_FORMAT);

    setFieldValue(fieldName, `${dateStr} ${newValue}`);
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
                id={build(id, "date")}
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
                id={build(id, "time")}
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
