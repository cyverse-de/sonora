import React from "react";

import { injectIntl } from "react-intl";
import { Field } from "formik";

import ids from "./ids";
import styles from "./styles";
import messages from "./messages";
import prefConstants from "./constants";
import GridLabelValue from "../utils/GridLabelValue";

import { build, getMessage, FormTextField, withI18N } from "@cyverse-de/ui-lib";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

function Shortcuts(props) {
    const { baseId } = props;
    const classes = useStyles();
    return (
        <>
            <Typography variant="h6" className={classes.sectionHeader}>
                {getMessage("keyboardShortcutHeaderLbl")}
            </Typography>
            <Grid container spacing={2} className={classes.grid}>
                <GridLabelValue
                    label={getMessage("appsViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            {prefConstants.defaults.KEYBOARD_SC_META_KEY}
                        </Typography>
                        <Field
                            id={build(baseId, ids.APPS_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name={prefConstants.keys.APPS_KB_SC}
                            className={classes.shortcutField}
                            inputProps={{ maxLength: 1 }}
                            variant="standard"
                            required={true}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("dataViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            {prefConstants.defaults.KEYBOARD_SC_META_KEY}
                        </Typography>
                        <Field
                            id={build(baseId, ids.DATA_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name={prefConstants.keys.DATA_KB_SC}
                            className={classes.shortcutField}
                            inputProps={{ maxLength: 1 }}
                            variant="standard"
                            required={true}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("analysesViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            {prefConstants.defaults.KEYBOARD_SC_META_KEY}
                        </Typography>
                        <Field
                            id={build(baseId, ids.ANALYSES_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name={prefConstants.keys.ANALYSES_KB_SC}
                            className={classes.shortcutField}
                            inputProps={{ maxLength: 1 }}
                            variant="standard"
                            required={true}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("notificationViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography component="span">
                            {prefConstants.defaults.KEYBOARD_SC_META_KEY}
                        </Typography>
                        <Field
                            id={build(
                                baseId,
                                ids.NOTIFICATIONS_KB_SHORTCUT_TEXT
                            )}
                            component={FormTextField}
                            name={prefConstants.keys.NOTIFICATION_KB_SC}
                            className={classes.shortcutField}
                            inputProps={{ maxLength: 1 }}
                            variant="standard"
                            required={true}
                        />
                    </>
                </GridLabelValue>
            </Grid>
        </>
    );
}
export default withI18N(injectIntl(Shortcuts), messages);
