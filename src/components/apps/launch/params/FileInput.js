/**
 * Form field for displaying FileInput parameters.
 *
 * @author psarando
 */
import React from "react";

import DiskResourceSelector from "./DiskResourceSelector";
import ResourceTypes from "components/models/ResourceTypes";

export default function FileInput(props) {
    return (
        <DiskResourceSelector acceptedType={ResourceTypes.FILE} {...props} />
    );
}
