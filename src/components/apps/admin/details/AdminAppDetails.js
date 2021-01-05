/**
 * @author aramsey, sriram
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import { useQuery } from "react-query";

import ids from "../../ids";

import {
    getAppDetailsForAdmin,
    ADMIN_APP_DETAILS_QUERY_KEY,
} from "serviceFacades/apps";

import {
    build,
    FormCheckbox,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";
import { Field, Form, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";

import { Button, Grid, Link, Paper } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default function AdminAppDetailsDialog(props) {
    const {
        open,
        app,
        parentId,
        restrictedChars,
        restrictedStartingChars,
        createDocWikiUrl,
        documentationTemplateUrl,
        handleSubmit,
        handleReset,
        handleClose,
    } = props;

    const [detailsError, setDetailsError] = useState(null);
    const [details, setDetails] = useState(null);

    const { isFetching: detailsFetching } = useQuery({
        queryKey: [
            ADMIN_APP_DETAILS_QUERY_KEY,
            {
                systemId: app?.system_id,
                appId: app?.id,
            },
        ],
        queryFn: getAppDetailsForAdmin,
        config: {
            enabled: !!app,
            onSuccess: setDetails,
            onError: (e) => {
                setDetailsError(e);
                console.log("error=>" + e);
            },
        },
    });

    return (
        <DEDialog
            open={open}
            fullWidth={true}
            maxWidth="lg"
            onClose={handleClose}
            baseId={parentId}
            title={app.name}
        >
            {detailsFetching && (
                <Skeleton animation="wave" variant="rect" height={800} />
            )}
            {details && (
                <Formik
                    initialValues={mapPropsToValues(app, details)}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ values }) => {
                        return (
                            <AdminAppDetailsForm
                                parentId={parentId}
                                restrictedChars={restrictedChars}
                                restrictedStartingChars={
                                    restrictedStartingChars
                                }
                                createDocWikiUrl={createDocWikiUrl}
                                documentationTemplateUrl={
                                    documentationTemplateUrl
                                }
                                handleClose={handleClose}
                            />
                        );
                    }}
                </Formik>
            )}
        </DEDialog>
    );
}

function mapPropsToValues(app, details) {
    return { ...app, ...details };
}

function AdminAppDetailsForm(props) {
    const {
        parentId,
        restrictedChars,
        restrictedStartingChars,
        createDocWikiUrl,
        documentationTemplateUrl,
        handleClose,
    } = props;

    const { t } = useTranslation("apps");
    const { t: i18nCommon } = useTranslation("common");
    return (
        <Form>
            <Field
                name={"name"}
                label={t("name")}
                id={build(parentId, ids.ADMIN_DETAILS.NAME)}
                validate={(value) =>
                    validateAppName(
                        restrictedStartingChars,
                        restrictedChars,
                        value
                    )
                }
                component={FormTextField}
            />
            <Field
                name={"description"}
                label={t("descriptionLabel")}
                id={build(parentId, ids.ADMIN_DETAILS.DESCRIPTION)}
                component={FormMultilineTextField}
            />
            <Field
                name={"integrator_name"}
                label={t("integratorName")}
                id={build(parentId, ids.ADMIN_DETAILS.INTEGRATOR)}
                component={FormTextField}
            />
            <Field
                name={"integrator_email"}
                label={t("integratorEmail")}
                id={build(parentId, ids.ADMIN_DETAILS.INTEGRATOR_EMAIL)}
                component={FormTextField}
            />
            <Field
                name={"extra.htcondor.extra_requirements"}
                label={t("htcondorExtraRequirements")}
                id={build(parentId, ids.ADMIN_DETAILS.HTCONDOR_EXTRA_REQS)}
                component={FormTextField}
            />
            <Field
                name={"deleted"}
                label={t("deleted")}
                id={build(parentId, ids.ADMIN_DETAILS.DELETED)}
                component={FormCheckbox}
            />
            <Field
                name={"disabled"}
                label={t("disabled")}
                id={build(parentId, ids.ADMIN_DETAILS.DISABLED)}
                component={FormCheckbox}
            />
            <Field
                name={"beta"}
                label={t("beta")}
                id={build(parentId, ids.ADMIN_DETAILS.BETA)}
                component={FormCheckbox}
            />
            <div>
                <Link onClick={() => window.open(createDocWikiUrl)}>
                    {t("wikiURLInstructions")}
                </Link>
            </div>
            <Field
                name={"wiki_url"}
                label={t("wikiUrl")}
                id={build(parentId, ids.ADMIN_DETAILS.WIKI_URL)}
                component={FormTextField}
            />
            <Paper elevation={1}>
                {t("documentationInstructions")}
                <Link onClick={() => window.open(documentationTemplateUrl)}>
                    {t("documentationTemplate")}
                </Link>
            </Paper>
            <Field
                name={"documentation.documentation"}
                label={t("appDocumentation")}
                id={build(parentId, ids.ADMIN_DETAILS.DOCUMENTATION)}
                t
                multiline
                rows={15}
                component={FormTextField}
            />
            <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
                spacing={1}
            >
                <Grid item>
                    <Button
                        variant="contained"
                        id={build(parentId, ids.CANCEL_BTN)}
                        onClick={handleClose}
                    >
                        {i18nCommon("cancel")}
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        id={build(parentId, ids.SAVE_BTN)}
                        type="submit"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {i18nCommon("save")}
                    </Button>
                </Grid>
            </Grid>
        </Form>
    );
}

function validateAppName(restrictedStartingChars, restrictedChars, value) {
    if (!value) {
        return "Empty value";
    }

    let startingCharsRegex = new RegExp("^[" + restrictedStartingChars + "]");
    let invalid = value.match(startingCharsRegex);
    if (invalid) {
        return (
            "App name cannot begin with `" +
            restrictedStartingChars +
            "`. Invalid char: `" +
            invalid +
            "`"
        );
    }

    // Escape each non-alphanumeric char since some are used as special chars in regex
    let escapedRestrictedChars = restrictedChars.replace(/\W/g, "\\$&");
    let restrictedCharsRegex = new RegExp(
        "[" + escapedRestrictedChars + "]",
        "g"
    );
    invalid = value.match(restrictedCharsRegex);
    if (invalid) {
        return (
            "App name cannot contain `" +
            restrictedChars +
            "`. Invalid chars: `" +
            invalid.join("") +
            "`"
        );
    }
}

const handleSubmit = (values, { props, setSubmitting }) => {
    const {
        presenter,
        details: { documentation = {} },
    } = props;
    let promises = [];
    if (props.app !== values) {
        let saveApp = new Promise((resolve, reject) => {
            presenter.onSaveAppSelected(values, resolve, reject);
        });
        promises.push(saveApp);
    }

    if (props.app.beta !== values.beta) {
        let betaUpdate = new Promise((resolve, reject) => {
            presenter.updateBetaStatus(values, resolve, reject);
        });
        promises.push(betaUpdate);
    }

    if (
        (!documentation || !documentation.documentation) &&
        values.documentation &&
        values.documentation.documentation
    ) {
        let addAppDoc = new Promise((resolve, reject) => {
            presenter.addAppDocumentation(
                values.system_id,
                values.id,
                values.documentation.documentation,
                resolve,
                reject
            );
        });
        promises.push(addAppDoc);
    } else if (
        values.documentation &&
        documentation.documentation !== values.documentation.documentation
    ) {
        let updateAppDoc = new Promise((resolve, reject) => {
            presenter.updateAppDocumentation(
                values.system_id,
                values.id,
                values.documentation.documentation,
                resolve,
                reject
            );
        });
        promises.push(updateAppDoc);
    }

    Promise.all(promises)
        .then(() => {
            setSubmitting(false);
            props.presenter.closeAppDetailsDlg();
        })
        .catch(() => {
            setSubmitting(false);
        });
};
