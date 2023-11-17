/**
 * @author aramsey
 *
 * A component for displaying a variety of information, particularly
 * user information.
 *
 * Must be wrapped in another component, like a MUI List, in order to look right.
 */

import React from "react";

import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";

function Identity(props) {
    const { avatar, primaryText, secondaryText, secondaryAction, ...rest } =
        props;
    return (
        <ListItem {...rest}>
            <ListItemAvatar>{avatar}</ListItemAvatar>
            <ListItemText primary={primaryText} secondary={secondaryText} />
            <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>
        </ListItem>
    );
}

export default Identity;
