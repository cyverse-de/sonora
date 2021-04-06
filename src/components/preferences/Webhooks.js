/**
 * @author sriram
 *
 * Webhook user preferences
 *
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import { Field } from "formik";

import { build, FormTextField, FormSwitch } from "@cyverse-de/ui-lib";

import ids from "./ids";
import styles from "./styles";

import { Button, Grid, Typography, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

export default function Webhooks(props) {
    const { baseId, hookTopics, hookTypes } = props;
    const { t } = useTranslation("preferences");
    const classes = useStyles();

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                Webhooks
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={12}>
                    <Typography>{t("webhooksPrompt")}</Typography>
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
                            <FormTextField
                                select
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
                                {hookTypes?.map((type, index) => (
                                    <MenuItem
                                        key={index}
                                        value={type.type}
                                        id={build(baseId, "hookType", type)}
                                    >
                                        {type.type}
                                    </MenuItem>
                                ))}
                            </FormTextField>
                        )}
                    </Field>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("webhookSelectedTopics")}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={12}>
                    {hookTopics?.map((topic, index) => (
                        <Field
                            id={build(baseId, `${topic.topic}`)}
                            component={FormSwitch}
                            name={`webhook.${topic.topic}`}
                            color="primary"
                            label={t(`${topic.topic}`)}
                            key={topic.topic}
                        />
                    ))}
                </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item xs={12}>
                    <Button variant="outlined">{t("test")}</Button>
                </Grid>
            </Grid>
        </>
    );
}
