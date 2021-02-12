/**
 * @author aramsey
 *
 * A single place to define what the icons for teams will be throughout the app
 */

import React from "react";
import { GroupAddOutlined, PeopleAltOutlined } from "@material-ui/icons";

export function TeamIcon(props) {
    return <PeopleAltOutlined {...props} />;
}

export function AddTeamIcon(props) {
    return <GroupAddOutlined {...props} />;
}
