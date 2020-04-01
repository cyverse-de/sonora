import React from "react";
import styles from "./styles";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Field } from "formik";
import MenuItem from "@material-ui/core/MenuItem";
import {
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib/dist/util/FormField";

const useStyles = makeStyles(styles);

export default function WebhooksTab() {
    const classes = useStyles();
    const webhookTypes = ["Slack", "Zapier", "Custom"];
    const onSwitchChange = (setFieldValue, fieldName, values, tag) => (
        event,
        checked
    ) => {
        let aux = [...values.apps_info.webhooks[0].topics];
        if (values.apps_info.webhooks[0].topics.includes(tag) === false) {
            aux.push(tag);
        } else if (values.apps_info.webhooks[0].topics.includes(tag) === true) {
            aux = aux.filter((e) => e !== tag);
        }
        console.log(fieldName);
        setFieldValue(fieldName, aux);
    };

    const FormSwitch = ({
        field: { value, onChange, checked, ...field },
        form: { setFieldValue, values },
        tag,
        ...custom
    }) => (
        <Switch
            onChange={onSwitchChange(setFieldValue, field.name, values, tag)}
            checked={values.apps_info.webhooks[0].topics.includes(tag)}
            {...custom}
        />
    );

    const deleteWebhook = (setFieldValue, values) => (event) => {
        console.log(values.apps_info.webhooks);
        values.apps_info.webhooks.pop();
        console.log(values.apps_info.webhooks);
        setFieldValue("apps_info.webhooks", values.apps_info.webhooks);
    };

    const WebhookDeleteButton = ({
        form: { setFieldValue, values },
        ...custom
    }) => (
        <IconButton onClick={deleteWebhook(setFieldValue, values)} {...custom}>
            <DeleteIcon fontSize="large" />
        </IconButton>
    );

    return (
        <div>
            <Typography className={classes.sectionHeader}>Webhooks</Typography>
            <br />
            <Field
                component={FormTextField}
                className={classes.webhooksTextField}
                label="Path"
                defaultValue="https://"
                variant="outlined"
                name="apps_info.webhooks[0].url"
            />
            <Field
                component={FormSelectField}
                name="apps_info.webhooks[0].type.type"
                className={classes.dropDown}
                fullWidth={false}
            >
                {webhookTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </Field>
            <Field
                aria-label="delete"
                color="inherit"
                component={WebhookDeleteButton}
            />
            <br />
            <br />
            <Typography className={classes.sectionHeader}>
                Select Topics:
            </Typography>
            <br />
            Data (e.g: When someone shares a file with you.)
            <Field
                component={FormSwitch}
                tag="data"
                name="apps_info.webhooks[0].topics"
                color="primary"
                inputProps={{ "aria-label": "Data" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Apps (e.g: When someone shares an app with you.)
            <Field
                component={FormSwitch}
                tag="apps"
                name="apps_info.webhooks[0].topics"
                color="primary"
                inputProps={{ "aria-label": "Apps" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Analyses (e.g: When your analysis status changes.)
            <Field
                component={FormSwitch}
                tag="analysis"
                name="apps_info.webhooks[0].topics"
                color="primary"
                inputProps={{ "aria-label": "Analyses" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Tools (e.g: When your tool request is complete.)
            <Field
                component={FormSwitch}
                tag="tool_request"
                name="apps_info.webhooks[0].topics"
                color="primary"
                inputProps={{ "aria-label": "Tools" }}
                className={classes.toggle}
            />
            <br />
            <br />
            Teams (e.g: When someone sends you a team invite or joins your
            team.)
            <Field
                component={FormSwitch}
                tag="team"
                name="apps_info.webhooks[0].topics"
                color="primary"
                inputProps={{ "aria-label": "Team" }}
                className={classes.toggle}
            />
        </div>
    );
}
