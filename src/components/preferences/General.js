/**
 *
 * @author Jack Mitt, sriram
 * General user preferences
 *
 *
 */

import React, { useState } from "react";

import { Field } from "formik";
import { useTranslation } from "react-i18next";

import prefConstants from "./constants";
import styles from "./styles";

import ids from "./ids";

import SelectionDrawer from "../data/SelectionDrawer";
import ResourceTypes from "../models/ResourceTypes";
import GridLabelValue from "../utils/GridLabelValue";

import constants from "../../constants";

import { build, FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    Switch,
    Typography,
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
    } = props;
    const { t } = useTranslation("preferences");
    const classes = useStyles();
    const [openFileBrowser, setOpenFileBrowser] = useState(false);

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
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {t("general")}
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <GridLabelValue
                    label={t("rememberLastPathLbl")}
                    variant="body1"
                >
                    <Field
                        id={build(baseId, ids.REMEMBER_LAST_PATH_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.REMEMBER_LAST_PATH}
                        color="primary"
                        inputProps={{
                            "aria-label": t("rememberLastPathLbl"),
                        }}
                    />
                </GridLabelValue>
                <GridLabelValue label={t("hpcPrompt")} variant="body1">
                    <Field
                        id={build(baseId, ids.HPC_LOGIN_PROMPT_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.ENABLE_HPC_PROMPT}
                        color="primary"
                        inputProps={{
                            "aria-label": t("hpcPrompt"),
                        }}
                    />
                </GridLabelValue>
                <GridLabelValue label={t("waitTimesWarning")} variant="body1">
                    <Field
                        id={build(baseId, ids.HPC_WAIT_TIMES_SWITCH)}
                        component={FormSwitch}
                        name={prefConstants.keys.ENABLE_WAIT_TIME_MESSAGE}
                        color="primary"
                        inputProps={{
                            "aria-label": t("waitTimesWarning"),
                        }}
                    />
                </GridLabelValue>
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
                <GridLabelValue
                    label={t("analysisStatusEmailLbl")}
                    variant="body1"
                >
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
                    />
                </GridLabelValue>
                <GridLabelValue label={t("urlImportEmailLbl")} variant="body1">
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
                    />
                </GridLabelValue>
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
