/**
 *
 * @author Jack Mitt, sriram
 * General user preferences
 *
 *
 */

import React, { useState } from "react";

import { Field } from "formik";
import { useTranslation } from "i18n";

import prefConstants from "./constants";
import styles from "./styles";

import ids from "./ids";

import SelectionDrawer from "../data/SelectionDrawer";
import ResourceTypes from "../models/ResourceTypes";
import GridLabelValue from "../utils/GridLabelValue";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import FormSwitch from "components/forms/FormSwitch";
import systemId from "components/models/systemId";

import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(styles);

function General(props) {
    const {
        baseId,
        defaultOutputFolder,
        onNewDefaultOutputFolder,
        isValidating,
        outputFolderValidationError,
        requireTapisAuth,
        resetHPCToken,
    } = props;
    const { t } = useTranslation("preferences");
    const { classes } = useStyles();
    const [openFileBrowser, setOpenFileBrowser] = useState(false);

    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("general")}
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <Grid item>
                    <Field
                        id={buildID(baseId, ids.REMEMBER_LAST_PATH_SWITCH)}
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
                        id={buildID(baseId, ids.HPC_LOGIN_PROMPT_SWITCH)}
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
                        id={buildID(baseId, ids.HPC_WAIT_TIMES_SWITCH)}
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
                            id={buildID(baseId, ids.DEFAULT_OUTPUT_FOLDER)}
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
                            id={buildID(baseId, ids.BROWSE_BUTTON)}
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
                        id={buildID(
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
                        id={buildID(
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
                <Grid item>
                    <Field
                        id={buildID(
                            baseId,
                            ids.PERIODIC_EMAIL_NOTIFICATION_SWITCH
                        )}
                        component={FormSwitch}
                        name={
                            prefConstants.keys
                                .ENABLE_PERIODIC_EMAIL_NOTIFICATION
                        }
                        color="primary"
                        inputProps={{
                            "aria-label": t("periodicEmailLbl"),
                        }}
                        label={t("periodicEmailLbl")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Field
                        id={buildID(baseId, ids.PERIODIC_NOTIFICATION_PERIOD)}
                        name={prefConstants.keys.PERIODIC_NOTIFICATION_PERIOD}
                        label={t("periodicPeriodLbl")}
                        component={FormTextField}
                        select
                    >
                        <MenuItem value={3600}>1 hour</MenuItem>
                        <MenuItem value={14400}>4 hours</MenuItem>
                        <MenuItem value={86400}>24 hours</MenuItem>
                    </Field>
                </Grid>
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
                        id={buildID(baseId, ids.RESET_HPC_BTN)}
                        color="primary"
                        variant="outlined"
                        disabled={requireTapisAuth}
                        onClick={() =>
                            resetHPCToken({
                                systemId: systemId.tapis,
                            })
                        }
                    >
                        {t("resetHPCTokenLbl")}
                    </Button>
                </GridLabelValue>
            </Grid>
            {defaultOutputFolder && (
                <SelectionDrawer
                    id={buildID(baseId, ids.FOLDER_SELECTION_DRAWER)}
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
