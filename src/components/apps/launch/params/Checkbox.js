/**
 * Form field for displaying Checkbox parameters.
 *
 * @author psarando
 */
import React from "react";

import FormCheckbox from "components/forms/FormCheckbox";

export default function Checkbox({ param, ...props }) {
    return (
        <FormCheckbox
            label={param?.label}
            helperText={param?.description}
            {...props}
        />
    );
}
