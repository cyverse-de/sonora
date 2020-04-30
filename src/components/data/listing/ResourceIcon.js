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
import { useTheme } from "@material-ui/core";

function ResourceIcon(props) {
    const { type, ...rest } = props;
    const theme = useTheme();

    if (type === ResourceTypes.FOLDER || type === "DIR") {
        return (
            <FolderIcon style={{ color: theme.palette.info.main }} {...rest} />
        );
    }
    if (type === ResourceTypes.FILE) {
        return (
            <FileIcon style={{ color: theme.palette.info.main }} {...rest} />
        );
    }

    return null;
}

export default ResourceIcon;
