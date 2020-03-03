import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "formik";
const useStyles = makeStyles(styles);

export default function WebhooksTab(props) {
    const classes = useStyles();

    const onSwitchChange = (setFieldValue, fieldName) => (event, checked) => {
        setFieldValue(fieldName, checked);
    };

    const FormSwitch = ({
        field: { value, onChange, ...field },
        form: { setFieldValue },
        ...custom
    }) => (
        <Switch
            checked={!!value}
            onChange={onSwitchChange(setFieldValue, field.name)}
            {...custom}
        />
    );

    return (
        <div>
            <Typography className={classes.sectionHeader}>Webhooks</Typography>
            <br />
            <TextField
                className={classes.textField}
                label="Path"
                defaultValue="https://"
                variant="outlined"
            />
            <TextField
                label="Name"
                variant="outlined"
                className={classes.smallTextField}
            />
            <IconButton aria-label="delete" color="inherit">
                <DeleteIcon fontSize="large" />
            </IconButton>
            <br />
            <br />
            <Typography className={classes.sectionHeader}>
                Select Topics:
            </Typography>
            <br />
            Data (e.g: When someone shares a file with you.)
            <Field
                component={FormSwitch}
                value="enableData"
                color="primary"
                inputProps={{ "aria-label": "Data" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Apps (e.g: When someone shares an app with you.)
            <Field
                component={FormSwitch}
                value="enableApps"
                color="primary"
                inputProps={{ "aria-label": "Apps" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Analyses (e.g: When your analysis status changes.)
            <Field
                component={FormSwitch}
                value="enableAnalyses"
                color="primary"
                inputProps={{ "aria-label": "Analyses" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Tools (e.g: When your tool request is complete.)
            <Field
                component={FormSwitch}
                value="enableTools"
                color="primary"
                inputProps={{ "aria-label": "Tools" }}
                className={classes.toggle}
            />
            <br />
        </div>
    );
}
