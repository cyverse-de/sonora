import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
const useStyles = makeStyles(styles);

export default function ShortcutsTab() {
    const classes = useStyles();

    return (
        <div>
            <Typography className={classes.sectionHeader}>
                Keyboard Shortcuts
            </Typography>
            <br />
            Open apps view
            <div className={classes.shortcut}>
                Control + Shift +
                <TextField
                    defaultValue={"A"}
                    className={classes.shortcutField}
                    size={"small"}
                    inputProps={{ maxLength: 1 }}
                />
            </div>
            <br />
            <br />
            Open data view
            <div className={classes.shortcut}>
                Control + Shift +
                <TextField
                    defaultValue={"A"}
                    className={classes.shortcutField}
                    size={"small"}
                    inputProps={{ maxLength: 1 }}
                />
            </div>
            <br />
            <br />
            Open analyses view
            <div className={classes.shortcut}>
                Control + Shift +
                <TextField
                    defaultValue={"A"}
                    className={classes.shortcutField}
                    size={"small"}
                    inputProps={{ maxLength: 1 }}
                />
            </div>
            <br />
            <br />
            Open notifications view
            <div className={classes.shortcut}>
                Control + Shift +
                <TextField
                    defaultValue={"A"}
                    className={classes.shortcutField}
                    size={"small"}
                    inputProps={{ maxLength: 1 }}
                />
            </div>
            <br />
            <br />
            Open active view
            <div className={classes.shortcut}>
                Control + Shift +
                <TextField
                    defaultValue={"A"}
                    className={classes.shortcutField}
                    size={"small"}
                    inputProps={{ maxLength: 1 }}
                />
            </div>
        </div>
    );
}
