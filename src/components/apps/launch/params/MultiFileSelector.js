/**
 * Form field for displaying MultiFileSelector parameters.
 *
 * @author psarando
 */
import React from "react";

import MultiInputSelector from "../MultiInputSelector";

import ResourceTypes from "components/models/ResourceTypes";

export default function MultiFileSelector({ param, ...props }) {
    return (
        <MultiInputSelector
            acceptedType={ResourceTypes.FILE}
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}
