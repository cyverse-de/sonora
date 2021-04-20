/**
 * Form field for displaying FileInput parameters.
 *
 * @author psarando
 */
import React from "react";

import InputSelector from "../InputSelector";

import ResourceTypes from "components/models/ResourceTypes";

export default function FileInput({ param, ...props }) {
    return (
        <InputSelector
            margin="normal"
            acceptedType={ResourceTypes.FILE}
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}
