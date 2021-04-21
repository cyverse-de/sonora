/**
 * Form field for displaying FileFolderInput parameters.
 *
 * @author psarando
 */
import React from "react";

import DiskResourceSelector from "./DiskResourceSelector";
import ResourceTypes from "components/models/ResourceTypes";

export default function FileFolderInput(props) {
    return <DiskResourceSelector acceptedType={ResourceTypes.ANY} {...props} />;
}
