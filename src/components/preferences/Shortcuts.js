import React from "react";

import { Field } from "formik";

import GridLabelValue from "../utils/GridLabelValue";
import styles from "./styles";

import Typography from "@material-ui/core/Typography";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

export default function Shortcuts() {
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
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                Keyboard Shortcuts
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <GridLabelValue label="Open apps view" labelVariant="body1">
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            component={FormTextField}
                            name="appsKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue label="Open data view" labelVariant="body1">
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            component={FormTextField}
                            name="dataKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue label="Open analyses view" labelVariant="body1">
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            component={FormTextField}
                            name="analysisKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label="Open notifications view"
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            component={FormTextField}
                            name="notificationKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
            </Grid>
        </>
    );
}
