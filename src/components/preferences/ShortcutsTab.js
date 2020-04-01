import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Field } from "formik";

const useStyles = makeStyles(styles);

export default function ShortcutsTab() {
    const classes = useStyles();

    const onTextChange = (setFieldValue, fieldName) => (event, value) => {
        const new_value = event.target.value;
        setFieldValue(fieldName, new_value);
    };

    const FormTextField = ({
        field: { value, onChange, ...field },
        form: { setFieldValue },
        ...custom
    }) => (
        <TextField
            value={value}
            onChange={onTextChange(setFieldValue, field.name)}
            size={"small"}
            inputProps={{ maxLength: 1 }}
            {...custom}
        />
    );

    return (
        <div>
            <Typography className={classes.sectionHeader}>
                Keyboard Shortcuts
            </Typography>
            <br />
            <Typography className={classes.section} display="inline">
                Open apps view
            </Typography>
            <Typography display="inline" className={classes.shortcut}>
                Control + Shift +
                <Field
                    component={FormTextField}
                    name="preferences.appsKBShortcut"
                    className={classes.shortcutField}
                />
            </Typography>
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Open data view
            </Typography>
            <Typography display="inline" className={classes.shortcut}>
                Control + Shift +
                <Field
                    component={FormTextField}
                    name="preferences.dataKBShortcut"
                    className={classes.shortcutField}
                />
            </Typography>
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Open analyses view
            </Typography>
            <Typography display="inline" className={classes.shortcut}>
                Control + Shift +
                <Field
                    component={FormTextField}
                    name="preferences.analysisKBShortcut"
                    className={classes.shortcutField}
                />
            </Typography>
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Open notifications view
            </Typography>
            <Typography display="inline" className={classes.shortcut}>
                Control + Shift +
                <Field
                    component={FormTextField}
                    name="preferences.notificationKBShortcut"
                    className={classes.shortcutField}
                />
            </Typography>
            <br />
        </div>
    );
}
