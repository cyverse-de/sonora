/**
 * @author sriram
 *
 * Create / Edit Reference Genome
 *
 *
 */

import React from "react";
import { injectIntl } from "react-intl";

import ids from "./ids";
import refGenomeConstants from "./constants";
import messages from "./messages";

import GridLabelValue from "../../../utils/GridLabelValue";

import {
    FormTextField,
    build,
    getMessage,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import { Button, Grid, Switch, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";

const styles = (theme) => ({
    grid: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.1),
        },
    },
    sectionHeader: {
        color: theme.palette.info.main,
        marginLeft: theme.spacing(1),
    },
    actionButton: {
        margin: theme.spacing(1),
    },
    textField: {
        marginTop: 0,
    },
});

const useStyles = makeStyles(styles);

function Edit(props) {
    const {
        baseId,
        onCancel,
        intl,
        referenceGenome,
        createRefGenome,
        saveRefGenome,
    } = props;
    const classes = useStyles();
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

    const handleSubmit = (values) => {
        if (referenceGenome?.id) {
            saveRefGenome(values);
        } else {
            createRefGenome({ name: values.name, path: values.path });
        }
    };

    return (
        <Formik initialValues={referenceGenome} onSubmit={handleSubmit}>
            {(props) => (
                <Form>
                    <Typography variant="h6" className={classes.sectionHeader}>
                        {referenceGenome?.name ||
                            formatMessage(intl, "createNew")}
                    </Typography>
                    <Grid container spacing={2} className={classes.grid}>
                        <GridLabelValue
                            label={formatMessage(intl, "name")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.NAME_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.NAME}
                                required={true}
                                className={classes.textField}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "path")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.PATH_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.PATH}
                                required={true}
                                className={classes.textField}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "createdBy")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.CREATED_BY_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.CREATED_BY}
                                required={true}
                                className={classes.textField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "createdOn")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.CREATED_ON_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.CREATED_ON}
                                required={true}
                                className={classes.textField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "lastModifiedOn")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.LAST_MODIFIED_ON_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.LAST_MODIFIED_ON}
                                required={true}
                                className={classes.textField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "lastModifiedBy")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.LAST_MODIFIED_BY_TEXT)}
                                component={FormTextField}
                                name={refGenomeConstants.keys.LAST_MODIFIED_BY}
                                required={true}
                                className={classes.textField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label={formatMessage(intl, "deleted")}
                            variant="body1"
                        >
                            <Field
                                id={build(baseId, ids.DELETED_SWITCH)}
                                component={FormSwitch}
                                name={refGenomeConstants.keys.DELETED}
                                color="primary"
                                className={classes.textField}
                            />
                        </GridLabelValue>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button
                                id={build(baseId, ids.CANCEL_BUTTON)}
                                className={classes.actionButton}
                                onClick={onCancel}
                            >
                                {getMessage("cancel")}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                id={build(baseId, ids.OK_BUTTON)}
                                className={classes.actionButton}
                                color="primary"
                                type="submit"
                            >
                                {getMessage("ok")}
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default withI18N(injectIntl(Edit), messages);
