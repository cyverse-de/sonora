/**
 * Form field for displaying FolderInput parameters.
 *
 * @author psarando
 */
import React from "react";

import DiskResourceSelector from "./DiskResourceSelector";
import ResourceTypes from "components/models/ResourceTypes";

export default function FolderInput(props) {
    return (
        <DiskResourceSelector acceptedType={ResourceTypes.FOLDER} {...props} />
    );
}
