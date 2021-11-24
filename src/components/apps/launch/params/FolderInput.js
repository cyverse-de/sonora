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
    const { multiSelect } = props;
    return (
        <DiskResourceSelector
            acceptedType={ResourceTypes.FOLDER}
            acceptedInfoTypes={
                !multiSelect ? [InfoTypes.HT_ANALYSIS_PATH_LIST] : null
            }
            {...props}
        />
    );
}
