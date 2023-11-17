/**
 * @author aramsey
 *
 * A function that returns an icon for a file system resource type
 */

import React from "react";

import {
    InsertDriveFileOutlined as FileIcon,
    Folder as FolderIcon,
} from "@mui/icons-material";
import ResourceTypes from "../../models/ResourceTypes";
import { useTheme } from "@mui/material";

function ResourceIcon(props) {
    const { type, ...custom } = props;
    const theme = useTheme();

    const iconStyle = { color: custom.color ? null : theme.palette.info.main };

    if (type === ResourceTypes.FOLDER || type === "DIR") {
        return <FolderIcon style={iconStyle} {...custom} />;
    }
    if (type === ResourceTypes.FILE) {
        return <FileIcon style={iconStyle} {...custom} />;
    }

    return null;
}

export default ResourceIcon;
