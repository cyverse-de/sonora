/**
 * Form field for displaying FileFolderInput parameters.
 *
 * @author psarando
 */
import React from "react";

import InputSelector from "../InputSelector";

import ResourceTypes from "components/models/ResourceTypes";

export default function FileFolderInput({ param, ...props }) {
    return (
        <InputSelector
            margin="normal"
            acceptedType={ResourceTypes.FOLDER}
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}
