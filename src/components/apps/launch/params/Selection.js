/**
 * Form field for displaying Selection parameters.
 *
 * @author psarando
 */
import React from "react";

import FormTextField from "components/forms/FormTextField";

import { MenuItem } from "@material-ui/core";

export default function Selection({ param, ...props }) {
    return (
        <FormTextField
            select
            variant="outlined"
            margin="normal"
            size="small"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        >
            {!param?.required && <MenuItem value="">&nbsp;</MenuItem>}
            {param?.arguments?.map((arg) => (
                // MenuItem.key can use arg.key or arg.id,
                // which should always be set (from the service or app editor),
                // but `name.value` should also be a reasonable fallback.
                <MenuItem
                    key={arg.key || arg.id || `${arg.name}.${arg.value}`}
                    value={arg}
                >
                    {arg.display}
                </MenuItem>
            ))}
        </FormTextField>
    );
}
