/**
 * @author aramsey
 *
 * A function that returns an icon for a file system resource type
 */

import React from "react";

import { Description, Folder } from "@material-ui/icons";

function ResourceIcon(props) {
    const { type } = props;

    if (type === "FOLDER" || type === "DIR") {
        return <Folder />;
    }
    if (type === "FILE") {
        return <Description />;
    }

    return null;
}

export default ResourceIcon;
