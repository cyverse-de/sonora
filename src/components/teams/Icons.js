/**
 * @author aramsey
 *
 * A single place to define what the icons for teams will be throughout the app
 */

import React from "react";
import { Group, GroupAdd } from "@material-ui/icons";

export function TeamIcon(props) {
    return <Group {...props} />;
}

export function AddTeamIcon(props) {
    return <GroupAdd {...props} />;
}
