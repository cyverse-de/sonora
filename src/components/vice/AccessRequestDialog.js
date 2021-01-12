/**
 *
 * @author sriram
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import {
    build,
    FormMultilineTextField,
    FormSelectField,
    FormTextField,
} from "@cyverse-de/ui-lib";
import { Field, Form, Formik } from "formik";

import { useUserProfile } from "contexts/userProfile";
import DEDialog from "components/utils/DEDialog";
import { Button, Grid, MenuItem, Typography } from "@material-ui/core";

export default function AccessRequestDialog(props) {
    const { open, baseId, onClose } = props;
    const { t } = useTranslation("vice");
    const { t: i18nCommon } = useTranslation("common");
    const [userProfile] = useUserProfile();
    const handleSubmit = (values) => {
        console.log("submitting values=>" + values);
    };
    return (
        <DEDialog
            open={open}
            onClose={onClose}
            baseId={baseId}
            title={t("accessRequestTitle")}
        >
            <Typography style={{ margin: 8 }}>
                {t("accessRequestPrompt")}
            </Typography>
            <Formik
                onSubmit={handleSubmit}
                enableReinitialize={true}
                initialValues={{
                    name: userProfile?.attributes.name,
                    email: userProfile?.attributes.email,
                }}
            >
                {({ values }) => {
                    return (
                        <Form>
                            <Field
                                name="name"
                                label={t("name")}
                                id={build(baseId, ids.ACCESS_REQUEST_DLG.NAME)}
                                required
                                component={FormTextField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <Field
                                name="email"
                                label={t("email")}
                                id={build(baseId, ids.ACCESS_REQUEST_DLG.EMAIL)}
                                required
                                component={FormTextField}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <Field
                                name="orcid"
                                label={t("orcid")}
                                id={build(baseId, ids.ACCESS_REQUEST_DLG.ORCID)}
                                required
                                component={FormTextField}
                                helperText={t("orcidHelp")}
                            />
                            <Field name="institution">
                                {({
                                    field: { onChange, ...field },
                                    ...props
                                }) => (
                                    <FormSelectField
                                        {...props}
                                        label={t("Affiliation")}
                                        required
                                        field={field}
                                        onChange={(event) => {
                                            onChange(event);
                                        }}
                                        id={build(baseId, "aff")}
                                    >
                                        <MenuItem
                                            key="univ"
                                            value="University"
                                            id={build(
                                                baseId,
                                                ids.ACCESS_REQUEST_DLG
                                                    .UNIVERSITY
                                            )}
                                        >
                                            {t("univ")}
                                        </MenuItem>
                                        <MenuItem
                                            key="nih"
                                            value="nih"
                                            id={build(
                                                baseId,
                                                ids.ACCESS_REQUEST_DLG
                                                    .UNIVERSITY
                                            )}
                                        >
                                            {t("nih")}
                                        </MenuItem>
                                        <MenuItem
                                            key="nsf"
                                            value="nsf"
                                            id={build(
                                                baseId,
                                                ids.ACCESS_REQUEST_DLG
                                                    .UNIVERSITY
                                            )}
                                        >
                                            {t("nsf")}
                                        </MenuItem>
                                        <MenuItem
                                            key="other"
                                            value="Other"
                                            id={build(
                                                baseId,
                                                ids.ACCESS_REQUEST_DLG.OTHER
                                            )}
                                        >
                                            {t("others")}
                                        </MenuItem>
                                    </FormSelectField>
                                )}
                            </Field>
                            <Field
                                name="affDetails"
                                label={t("moreDetails")}
                                id={build(
                                    baseId,
                                    ids.ACCESS_REQUEST_DLG.AFF_DETAILS
                                )}
                                required
                                component={FormMultilineTextField}
                            />
                            <Field
                                name="intended_use"
                                label={t("useCase")}
                                id={build(
                                    baseId,
                                    ids.ACCESS_REQUEST_DLG.USE_CASE
                                )}
                                required
                                component={FormMultilineTextField}
                            />
                            <Field
                                name="details"
                                label={t("otherDetails")}
                                id={build(
                                    baseId,
                                    ids.ACCESS_REQUEST_DLG.DETAILS
                                )}
                                component={FormMultilineTextField}
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
                                        id={build(
                                            baseId,
                                            ids.ACCESS_REQUEST_DLG.CANCEL
                                        )}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        id={build(
                                            baseId,
                                            ids.ACCESS_REQUEST_DLG.SUBMIT
                                        )}
                                        type="submit"
                                        color="primary"
                                    >
                                        {i18nCommon("submit")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </DEDialog>
    );
}
