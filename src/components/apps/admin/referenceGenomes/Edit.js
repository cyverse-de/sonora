/**
 * @author sriram
 *
 * Create / Edit Reference Genome
 *
 *
 */

import React from "react";
import GridLabelValue from "../../../utils/GridLabelValue";

import { FormTextField } from "@cyverse-de/ui-lib";
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
});

const useStyles = makeStyles(styles);

function Edit(props) {
    const { onCancel, values, saveRefGenome } = props;
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
        console.log(values);
        saveRefGenome(values);
    };

    return (
        <Formik initialValues={values} onSubmit={handleSubmit}>
            {(props) => (
                <Form>
                    <Typography variant="h6" className={classes.sectionHeader}>
                        {values?.name || "Create New"}
                    </Typography>
                    <Grid container spacing={2} className={classes.grid}>
                        <GridLabelValue label="Name" variant="body1">
                            <Field
                                component={FormTextField}
                                name={"name"}
                                required={true}
                            />
                        </GridLabelValue>
                        <GridLabelValue label="Path" variant="body1">
                            <Field
                                component={FormTextField}
                                name={"path"}
                                required={true}
                            />
                        </GridLabelValue>
                        <GridLabelValue label="Created By" variant="body1">
                            <Field
                                component={FormTextField}
                                name={"created_by"}
                                required={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue label="Created On" variant="body1">
                            <Field
                                component={FormTextField}
                                name={"created_on"}
                                required={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue label="Last Modified" variant="body1">
                            <Field
                                component={FormTextField}
                                name={"last_modified_by"}
                                required={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue
                            label="Last Modified By"
                            variant="body1"
                        >
                            <Field
                                component={FormTextField}
                                name={"last_modified_on"}
                                required={true}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </GridLabelValue>
                        <GridLabelValue label="Mark as deleted" variant="body1">
                            <Field
                                component={FormSwitch}
                                name="deleted"
                                color="primary"
                            />
                        </GridLabelValue>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button
                                className={classes.actionButton}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className={classes.actionButton}
                                color="primary"
                                type="submit"
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}

export default Edit;
