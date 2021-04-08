/**
 * Form field for displaying Selection parameters.
 *
 * @author psarando
 */
import React from "react";

import { FormTextField } from "@cyverse-de/ui-lib";

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
            {param?.arguments?.map((arg) => (
                <MenuItem key={arg.value} value={arg}>
                    {arg.display}
                </MenuItem>
            ))}
        </FormTextField>
    );
}
