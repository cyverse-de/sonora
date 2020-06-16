import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { Field } from "formik";

import styles from "./styles";
import messages from "./messages";
import ids from "./ids";
import SelectionDrawer from "../data/SelectionDrawer";
import ResourceTypes from "../models/ResourceTypes";
import GridLabelValue from "../utils/GridLabelValue";

import { build, FormTextField, getMessage, withI18N } from "@cyverse-de/ui-lib";

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
    } = props;
    const classes = useStyles();
    const [openFileBrowser, setOpenFileBrowser] = useState(false);

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
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {getMessage("general")}
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <GridLabelValue
                    label={getMessage("rememberLastPathLbl")}
                    labelVariant="body1"
                >
                    <Field
                        id={build(baseId, ids.REMEMBER_LAST_PATH_SWITCH)}
                        component={FormSwitch}
                        name="rememberLastPath"
                        color="primary"
                        inputProps={{ "aria-label": "primary checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("hpcPrompt")}
                    labelVariant="body1"
                >
                    <Field
                        id={build(baseId, ids.HPC_LOGIN_PROMPT_SWITCH)}
                        component={FormSwitch}
                        name="enableHPCPrompt"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("waitTimesWarning")}
                    labelVariant="body1"
                >
                    <Field
                        id={build(baseId, ids.HPC_WAIT_TIMES_SWITCH)}
                        component={FormSwitch}
                        name="enableWaitTimeMessage"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                {getMessage("defaultFolderHeaderLbl")}
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <Grid item>
                    <>
                        <Field
                            id={build(baseId, ids.DEFAULT_OUTPUT_FOLDER)}
                            component={FormTextField}
                            className={classes.textField}
                            name="defaultOutputFolder"
                            helperText={outputFolderValidationError}
                            error={outputFolderValidationError ? true : false}
                            // without this prop, there will be an exception in console
                            //about making an uncontrolled component to controlled.
                            value={
                                defaultOutputFolder ? defaultOutputFolder : ""
                            }
                            label="Path"
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
                            className={classes.actionButton}
                            onClick={() => setOpenFileBrowser(true)}
                            variant="outlined"
                            style={{ marginTop: 8, marginLeft: 8 }}
                        >
                            Browse
                        </Button>
                    </>
                </Grid>
            </Grid>
            <Divider className={classes.dividers} />
            <Typography variant="h6" className={classes.sectionHeader}>
                {getMessage("emailNotificationsHeaderLbl")}
            </Typography>
            <Grid container spacing={3} className={classes.grid}>
                <GridLabelValue
                    label={getMessage("analysisStatusEmailLbl")}
                    labelVariant="body1"
                >
                    <Field
                        id={build(
                            baseId,
                            ids.ANALYSES_EMAIL_NOTIFICATION_SWITCH
                        )}
                        component={FormSwitch}
                        name="enableAnalysisEmailNotification"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("urlImportEmailLbl")}
                    labelVariant="body1"
                >
                    <Field
                        id={build(
                            baseId,
                            ids.URL_IMPORT_EMAIL_NOTIFICATION_SWITCH
                        )}
                        component={FormSwitch}
                        name="enableImportEmailNotification"
                        color="primary"
                        inputProps={{ "aria-label": "another checkbox" }}
                    />
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
                    baseId="dataSelection"
                    multiSelect={false}
                />
            )}
        </>
    );
}

export default withI18N(injectIntl(General), messages);
