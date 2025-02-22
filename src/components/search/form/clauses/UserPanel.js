/**
 * @author aramsey
 *
 * Not an actual clause, but a component for use in other clauses.
 *
 * Displays a list of selected users in Chip form.
 */
import React from "react";

import { Chip, Grid, Paper } from "@mui/material";

import { makeStyles } from "tss-react/mui";

import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";
import styles from "../styles";

const useStyles = makeStyles()(styles);

function UserPanel(props) {
    const { users, onDelete, parentId } = props;
    const { classes } = useStyles();
    const panelId = buildID(parentId, ids.USER_PANEL);

    if (!users?.length > 0) {
        return null;
    }

    return (
        <Paper id={panelId} classes={{ root: classes.paperPadding }}>
            <Grid container spacing={1}>
                {users?.map((user, index) => (
                    <Grid key={user} item>
                        <Chip
                            id={buildID(panelId, user)}
                            onDelete={() => onDelete(index)}
                            label={user}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default UserPanel;
