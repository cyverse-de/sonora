/**
 * @author sriram
 *
 * Webhook user preferences
 *
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Field, FieldArray } from "formik";

import {
    build,
    FormTextField,
    FormSelectField,
    FormSwitch,
} from "@cyverse-de/ui-lib";

import ids from "./ids";
import styles from "./styles";

import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

export default function Webhooks(props) {
    const { baseId, values, hookTopics, hookTypes } = props;
    const { t } = useTranslation("preferences");
    const classes = useStyles();

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                Webhooks
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item>
                    <Typography>
                        Add incoming webhook integration. The DE will post
                        notifications to this URL:
                    </Typography>
                </Grid>
                <Grid item>
                    <Field
                        id={build(baseId, "hookUrl")}
                        component={FormTextField}
                        name="webhook.url"
                    />
                </Grid>
                <Grid item>
                    <Field name="webhook.type.type">
                        {({ field: { onChange, ...field }, ...props }) => (
                            <FormSelectField
                                {...props}
                                label={t("type")}
                                required
                                field={field}
                                onChange={(event) => {
                                    onChange(event);
                                }}
                                id={build(baseId, "hookType")}
                                variant="outlined"
                                size="small"
                            >
                                {hookTypes.map((type, index) => (
                                    <MenuItem
                                        key={index}
                                        value={type.type}
                                        id={build(baseId, "hookType", type)}
                                    >
                                        {type.type}
                                    </MenuItem>
                                ))}
                            </FormSelectField>
                        )}
                    </Field>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">Select Topics:</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.grid}>
                <FieldArray
                    name="webhook.topics"
                    render={(arrayHelpers) => (
                        <Grid item>
                            {topics.map((topic, index) => (
                                <Field
                                    component={FormSwitch}
                                    name={`webhook.topic.${index}`}
                                    color="primary"
                                    label={topic.topic}
                                />
                            ))}
                        </Grid>
                    )}
                />
            </Grid>
        </>
    );
}
