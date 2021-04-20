/**
 * Form field for displaying FileInput parameters.
 *
 * @author psarando
 */
import React from "react";

import InputSelector from "../InputSelector";

import ResourceTypes from "components/models/ResourceTypes";

import { useBootstrapInfo } from "contexts/bootstrap";

export default function FileInput({ param, ...props }) {
    const bootstrapInfo = useBootstrapInfo()[0];
    const pref = bootstrapInfo?.preferences;
    return (
        <InputSelector
            margin="normal"
            acceptedType={ResourceTypes.FILE}
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            startingPath={
                pref?.rememberLastPath
                    ? pref?.lastFolder
                    : pref?.defaultFileSelectorPath
            }
            {...props}
        />
    );
}
