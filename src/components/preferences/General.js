/**
 *
 * @author Jack Mitt, sriram
 * General user preferences
 *
 *
 */

import React, { useState } from "react";

import { Field, FieldArray } from "formik";
import { useTranslation } from "i18n";

import prefConstants from "./constants";
import styles from "./styles";

import ids from "./ids";

import SelectionDrawer from "../data/SelectionDrawer";
import ResourceTypes from "../models/ResourceTypes";
import GridLabelValue from "../utils/GridLabelValue";

import constants from "../../constants";

import {
    build,
    FormTextField,
    FormSelectField,
    FormSwitch,
} from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    MenuItem,
    Switch,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

function General(props) {
    const {
        baseId,
        defaultOutputFolder,
        onNewDefaultOutputFolder,
        isValidating,
        outputFolderValidationError,
        requireAgaveAuth,
        resetHPCToken,
        values,
    } = props;
    const { t } = useTranslation("preferences");
    const classes = useStyles();
    const [openFileBrowser, setOpenFileBrowser] = useState(false);
    const hookTypes = [
        {
            id: "f4dbf5f4-c3f6-11e7-a333-008cfa5ae621",
            type: "Slack",
            template:
                '\n{\n\t"text": "{{.Msg}}. {{if .Completed}} <{{.Link}}|{{.LinkText}}> {{- end}}"\n}\n',
        },
        {
            id: "c9cd5218-d9e0-11e7-ac79-008cfa5ae621",
            type: "Zapier",
            template:
                '{"id": "{{.ID}}","name": "{{.Name}}","text": "{{.Msg}}. {{if .Completed}} <{{.Link}}|{{.LinkText}}> {{- end}}"}',
        },
        {
            id: "32aaf1c4-91db-11e9-857c-008cfa5ae621",
            type: "Custom",
            template: "",
        },
    ];

    const topics = [
        {
            id: "f4dcbf16-c3f6-11e7-a333-008cfa5ae621",
            topic: "data",
        },
        {
            id: "f4dced88-c3f6-11e7-a333-008cfa5ae621",
            topic: "apps",
        },
        {
            id: "f4dd14f2-c3f6-11e7-a333-008cfa5ae621",
            topic: "analysis",
        },
        {
            id: "f4dd39fa-c3f6-11e7-a333-008cfa5ae621",
            topic: "permanent_id_request",
        },
        {
            id: "f4dd6164-c3f6-11e7-a333-008cfa5ae621",
            topic: "team",
        },
        {
            id: "f4dd834c-c3f6-11e7-a333-008cfa5ae621",
            topic: "tool_request",
        },
    ];

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("general")}
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <Grid item>
                    <Field
                        id={build(baseId, ids.REMEMBER_LAST_PATH_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.REMEMBER_LAST_PATH}
                        color="primary"
                        label={t("rememberLastPathLbl")}
                        inputProps={{
                            "aria-label": t("rememberLastPathLbl"),
                        }}
                    />
                </Grid>
                <Grid item>
                    <Field
                        id={build(baseId, ids.HPC_LOGIN_PROMPT_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.ENABLE_HPC_PROMPT}
                        color="primary"
                        label={t("hpcPrompt")}
                        inputProps={{
                            "aria-label": t("hpcPrompt"),
                        }}
                    />
                </Grid>
                <Grid item>
                    <Field
                        id={build(baseId, ids.HPC_WAIT_TIMES_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.ENABLE_WAIT_TIME_MESSAGE}
                        color="primary"
                        label={t("waitTimesWarning")}
                        inputProps={{
                            "aria-label": t("waitTimesWarning"),
                        }}
                    />
                </Grid>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("defaultFolderHeaderLbl")}
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item>
                    <>
                        <Field
                            id={build(baseId, ids.DEFAULT_OUTPUT_FOLDER)}
                            component={FormTextField}
                            className={classes.textField}
                            name={prefConstants.keys.DEFAULT_OUTPUT_FOLDER}
                            helperText={outputFolderValidationError}
                            error={outputFolderValidationError ? true : false}
                            // without this prop, there will be an exception in console
                            //about making an uncontrolled component to controlled.
                            value={
                                defaultOutputFolder ? defaultOutputFolder : ""
                            }
                            label={t("path")}
                            variant="outlined"
                            required={true}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    setOpenFileBrowser(true);
                                }
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <>
                                        {isValidating && (
                                            <InputAdornment position="start">
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            </InputAdornment>
                                        )}
                                    </>
                                ),
                            }}
                        />
                        <Button
                            color="primary"
                            id={build(baseId, ids.BROWSE_BUTTON)}
                            className={classes.browseButton}
                            onClick={() => setOpenFileBrowser(true)}
                            variant="outlined"
                        >
                            {t("browse")}
                        </Button>
                    </>
                </Grid>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("emailNotificationsHeaderLbl")}
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item>
                    <Field
                        id={build(
                            baseId,
                            ids.ANALYSES_EMAIL_NOTIFICATION_SWITCH
                        )}
                        component={FormSwitch}
                        name={
                            prefConstants.keys
                                .ENABLE_ANALYSIS_EMAIL_NOTIFICATION
                        }
                        color="primary"
                        inputProps={{
                            "aria-label": t("analysisStatusEmailLbl"),
                        }}
                        label={t("analysisStatusEmailLbl")}
                    />
                </Grid>
                <Grid item>
                    <Field
                        id={build(
                            baseId,
                            ids.URL_IMPORT_EMAIL_NOTIFICATION_SWITCH
                        )}
                        component={FormSwitch}
                        name={
                            prefConstants.keys.ENABLE_IMPORT_EMAIL_NOTIFICATION
                        }
                        color="primary"
                        inputProps={{
                            "aria-label": t("urlImportEmailLbl"),
                        }}
                        label={t("urlImportEmailLbl")}
                    />
                </Grid>
            </Grid>
            <Divider className={classes.dividers} />
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
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("resetHPCTokenLbl")}
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <GridLabelValue
                    label={t("resetHPCTokenPrompt")}
                    variant="body1"
                >
                    <Button
                        id={build(baseId, ids.RESET_HPC_BTN)}
                        color="primary"
                        variant="outlined"
                        disabled={requireAgaveAuth}
                        onClick={() =>
                            resetHPCToken({
                                systemId: constants.AGAVE_SYSTEM_ID,
                            })
                        }
                    >
                        {t("resetHPCTokenLbl")}
                    </Button>
                </GridLabelValue>
            </Grid>
            {defaultOutputFolder && (
                <SelectionDrawer
                    id={build(baseId, ids.FOLDER_SELECTION_DRAWER)}
                    open={openFileBrowser}
                    onClose={() => setOpenFileBrowser(false)}
                    startingPath={defaultOutputFolder}
                    acceptedType={ResourceTypes.FOLDER}
                    onConfirm={(selection) => {
                        setOpenFileBrowser(false);
                        onNewDefaultOutputFolder(selection);
                    }}
                    baseId={baseId}
                    multiSelect={false}
                />
            )}
        </>
    );
}

export default General;
