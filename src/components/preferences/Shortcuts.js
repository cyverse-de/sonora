import React from "react";
import { injectIntl } from "react-intl";
import { Field } from "formik";

import ids from "./ids";
import styles from "./styles";
import messages from "./messages";
import GridLabelValue from "../utils/GridLabelValue";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";

import { Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

function Shortcuts(props) {
    const { baseId } = props;
    const classes = useStyles();

    const onTextChange = (setFieldValue, fieldName) => (event, value) => {
        const new_value = event.target.value;
        setFieldValue(fieldName, new_value);
    };

    const FormTextField = ({
        field: { value, onChange, ...field },
        form: { setFieldValue },
        ...custom
    }) => (
        <TextField
            value={value}
            onChange={onTextChange(setFieldValue, field.name)}
            size={"small"}
            inputProps={{ maxLength: 1 }}
            {...custom}
        />
    );

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
                            Control + Shift +
                        </Typography>
                        <Field
                            id={build(baseId, ids.APP_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name="appsKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("dataViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            id={build(baseId, ids.DATA_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name="dataKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("analysesViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            id={build(baseId, ids.ANALYSES_KB_SHORTCUT_TEXT)}
                            component={FormTextField}
                            name="analysisKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
                <GridLabelValue
                    label={getMessage("notificationViewShortcutLbl")}
                    labelVariant="body1"
                >
                    <>
                        <Typography display="inline">
                            Control + Shift +
                        </Typography>
                        <Field
                            id={build(
                                baseId,
                                ids.NOTIFICATIONS_KB_SHORTCUT_TEXT
                            )}
                            component={FormTextField}
                            name="notificationKBShortcut"
                            className={classes.shortcutField}
                        />
                    </>
                </GridLabelValue>
            </Grid>
        </>
    );
}
export default withI18N(injectIntl(Shortcuts), messages);
