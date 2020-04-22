/**
 * @author aramsey
 *
 * A function that returns an icon for a file system resource type
 */

import React from "react";

import {
    InsertDriveFileOutlined as FileIcon,
    Folder as FolderIcon,
} from "@material-ui/icons";
import ResourceTypes from "../../models/ResourceTypes";

function ResourceIcon(props) {
    const { type, ...rest } = props;

    if (type === ResourceTypes.FOLDER || type === "DIR") {
        return <FolderIcon color="primary" {...rest} />;
    }
    if (type === ResourceTypes.FILE) {
        return <FileIcon color="primary" {...rest} />;
    }

    return null;
}

export default ResourceIcon;
