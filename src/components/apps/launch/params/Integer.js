/**
 * Form field for displaying Integer parameters.
 *
 * @author psarando
 */
import React from "react";

import FormIntegerField from "components/forms/FormIntegerField";

export default function Integer({ param, ...props }) {
    return (
        <FormIntegerField
            size="small"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}
