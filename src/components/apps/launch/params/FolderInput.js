/**
 * Form field for displaying FileFolderInput parameters.
 *
 * @author psarando
 */
import React from "react";

import InputSelector from "../InputSelector";

import ResourceTypes from "components/models/ResourceTypes";

import { useBootstrapInfo } from "contexts/bootstrap";

export default function FileFolderInput({ param, ...props }) {
    const bootstrapInfo = useBootstrapInfo()[0];
    const pref = bootstrapInfo?.preferences;
    return (
        <InputSelector
            margin="normal"
            acceptedType={ResourceTypes.FOLDER}
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
