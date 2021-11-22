/**
 * Form field for displaying FolderInput parameters.
 *
 * @author psarando
 */
import React from "react";

import DiskResourceSelector from "./DiskResourceSelector";
import ResourceTypes from "components/models/ResourceTypes";
import InfoTypes from "components/models/InfoTypes";

export default function FolderInput(props) {
    return (
        <DiskResourceSelector
            acceptedType={ResourceTypes.FOLDER}
            acceptedInfoTypes={[InfoTypes.HT_ANALYSIS_PATH_LIST]}
            {...props}
        />
    );
}
