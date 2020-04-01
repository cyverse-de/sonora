import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Field } from "formik";

const useStyles = makeStyles(styles);

function browseFiles() {
    console.log("User clicked the file browser.");
    //TODO figure out what happens here
    //DATA VIEW IN A DRAWER?
}

export default function PreferencesTab(props) {
    const classes = useStyles();

    const onSwitchChange = (setFieldValue, fieldName) => (event, checked) => {
        console.log(fieldName);
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
        <div className={classes.preferences}>
            <Typography className={classes.sectionHeader}>General</Typography>
            <br />
            <Typography className={classes.section} display="inline">
                Remember last file path for Apps
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.rememberLastPath"
                value="rememberLastPath"
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Save Session
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.saveSession"
                value="saveSession"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Prompt for HPC apps authentication after log-on,
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.enableHPCPrompt"
                value="enableHPCPrompt"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <Typography className={classes.section} display="inline">
                or when apps window is opened
            </Typography>
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Display Warning about wait times for submitting HPC apps
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.enableWaitTimeMessage"
                value="enableWaitTimeMessage"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            <Divider className={classes.dividers} />
            <Typography className={classes.sectionHeader}>
                Default analysis output folder
            </Typography>
            <br />
            {/* TODO make default text the path with the user's name in it */}
            <TextField
                className={classes.textField}
                label="Path"
                defaultValue="/iplant/home/mgwall/analyses"
                variant="outlined"
            />
            <Button
                color="primary"
                className={classes.actionButton}
                onClick={browseFiles}
            >
                BROWSE
            </Button>

            <br />
            <br />
            <Divider className={classes.dividers} />
            <Typography className={classes.sectionHeader}>
                Email Notifications
            </Typography>
            <br />
            <Typography className={classes.section} display="inline">
                Email me when my analysis status changes
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.enableAnalysisEmailNotification"
                value="enableAnalysisEmail"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
            <br />
            <br />
            <Typography className={classes.section} display="inline">
                Email me when my URL import status changes
            </Typography>
            <Field
                component={FormSwitch}
                name="preferences.enableImportEmailNotification"
                value="enableImportEmail"
                color="primary"
                inputProps={{ "aria-label": "another checkbox" }}
                className={classes.toggle}
            />
        </div>
    );
}
