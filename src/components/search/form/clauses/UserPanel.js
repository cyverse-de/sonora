/**
 * @author aramsey
 *
 * Not an actual clause, but a component for use in other clauses.
 *
 * Displays a list of selected users in Chip form.
 */
import React from "react";

import { Chip, Paper } from "@material-ui/core";

import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

function UserPanel(props) {
    const { users, onDelete, parentId } = props;
    const panelId = buildID(parentId, ids.USER_PANEL)
    return (
        <Paper id={panelId}>
            {users?.map((user, index) => (
                <Chip
                    id={buildID(panelId, user)}
                    onDelete={() => onDelete(index)}
                    label={user}
                />
            ))}
        </Paper>
    );
}

export default UserPanel;