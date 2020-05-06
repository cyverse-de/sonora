import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";
import PreferencesTab from "./PreferencesTab";
import ShortcutsTab from "./ShortcutsTab";
import { DialogActions, Button } from "@material-ui/core";
import { Formik, Form } from "formik";
import { DEConfirmationDialog, LoadingMask } from "@cyverse-de/ui-lib";

const useStyles = makeStyles(styles);

export default function PreferencesPage(props) {
    const [restoreDef, setRestoreDef] = useState(false);
    const classes = useStyles();
    const { config } = props;

    const handleSubmit = (values, actions) => {
        actions.setSubmitting = true;
        console.log(values);
    };

    const restoreDefaults = (setFieldValue) => (event) => {
        setFieldValue("preferences.rememberLastPath", true);
        setFieldValue("preferences.saveSession", true);
        setFieldValue("preferences.enableImportEmailNotification", true);
        setFieldValue("preferences.enableWaitTimeMessage", true);
        setFieldValue("preferences.enableAnalysisEmailNotification", true);
        setFieldValue("preferences.enableHPCPrompt", true);
        setFieldValue("preferences.notificationKBShortcut", "N");
        setFieldValue("preferences.dataKBShortcut", "D");
        setFieldValue("preferences.closeKBShortcut", "Q");
        setFieldValue("preferences.appsKBShortcut", "A");
        setFieldValue("preferences.analysisKBShortcut", "Y");
        //TODO append username to start of irods home path
        setFieldValue(
            "preferences.default_output_folder",
            process.env.irodsHomePath
        );
        setRestoreDef(false);
    };

    return (
        <div className={classes.root}>
            <Formik initialValues={config} onSubmit={handleSubmit}>
                {(props) => (
                    <Form>
                        <PreferencesTab config={props} />
                        <br />
                        <br />
                        <ShortcutsTab />
                        <br />
                        <DialogActions>
                            <Button
                                className={classes.actionButton}
                                color="primary"
                                onClick={() => setRestoreDef(true)}
                            >
                                RESTORE DEFAULTS
                            </Button>
                            <Button
                                className={classes.actionButton}
                                color="primary"
                                type="submit"
                            >
                                SAVE
                            </Button>
                        </DialogActions>
                        <DEConfirmationDialog
                            dialogOpen={restoreDef}
                            debugID="temp"
                            onOkBtnClick={restoreDefaults(props.setFieldValue)}
                            okLabel="Restore Defaults"
                            onCancelBtnClick={() => setRestoreDef(false)}
                            heading="Restore Defaults"
                            messages="messaging"
                            message={
                                <LoadingMask loading={false}>
                                    <div>
                                        Are you sure you would like to restore
                                        defaults?
                                    </div>
                                </LoadingMask>
                            }
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
}
