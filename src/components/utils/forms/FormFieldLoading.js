/**
 * @author psarando
 *
 * A Form Field placeholder that can display as a loading skeleton while values
 * are fetched from backend services. The loading skeleton can still display
 * helperText and validation error messages, such as a `Required` validation
 * error message if the form is submitted before values are loaded.
 */
import React from "react";

import buildDebugId from "../DebugIDUtil";
import ids from "../ids";

import getFormError from "./getFormError";

import {
    FormControl,
    InputLabel,
    FormHelperText,
    makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

// Set the skeleton's height to about the same height as text or select fields.
const useStyles = makeStyles((theme) => ({
    skeleton: {
        height: theme.spacing(6),
    },
}));

const FormFieldLoading = ({
    id,
    field: { name },
    label,
    helperText,
    required,
    form: { touched, errors },
    ...props
}) => {
    const classes = useStyles();
    const errorMsg = getFormError(name, touched, errors);
    const loadingFieldID = buildDebugId(id, ids.LOADING_SKELETON);
    const helperTextID = buildDebugId(loadingFieldID, ids.HELPER_TEXT);

    return (
        <FormControl fullWidth error={!!errorMsg}>
            <InputLabel htmlFor={loadingFieldID} required={required}>
                {label}
            </InputLabel>
            <Skeleton
                id={loadingFieldID}
                aria-describedby={helperTextID}
                variant="text"
                className={classes.skeleton}
                {...props}
            />
            <FormHelperText id={helperTextID}>
                {errorMsg || helperText}
            </FormHelperText>
        </FormControl>
    );
};

export default FormFieldLoading;
