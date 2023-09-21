/**
 * @author aramsey
 *
 * A single place to define what the icons for teams will be throughout the app
 */

import React from "react";
import { GroupAddOutlined, PeopleAltOutlined } from "@mui/icons-material";

export function TeamIcon(props) {
    return <PeopleAltOutlined {...props} />;
}

export function AddTeamIcon(props) {
    return <GroupAddOutlined {...props} />;
}
