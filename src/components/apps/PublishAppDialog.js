/**
 *
 * A dialog thru which users can request to make their app public
 *
 * @author sriram
 *
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { Field, FieldArray, Form, Formik } from "formik";
import { useQuery, useMutation, queryCache } from "react-query";

import ids from "./ids";

import appsConstants from "./constants";

import {
    build,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import DEDialog from "components/utils/DEDialog";
import InputSelector from "components/apps/launch/InputSelector";
import ResourceTypes from "components/models/ResourceTypes";
import { validateAppName } from "components/apps/utils";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { Skeleton } from "@material-ui/lab";
import { Add, Remove } from "@material-ui/icons";
import {
    Button,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
} from "@material-ui/core";

export default function PublishAppDialog(props) {
    const { open, app, handleClose } = props;
    const { t } = useTranslation("apps");
    const { t: i18nCommon } = useTranslation("common");
    const parentId = "publishDlg";
    const handleSubmit = (values) => {
        console.log("values=>" + JSON.stringify(values));
    };
    return (
        <Formik
            initialValues={{
                name: app?.name,
                description: app?.description,
                system_id: app?.system_id,
                testData: "",
                inputDesc: "",
                parameterDesc: "",
                outputDesc: "",
                links: [],
            }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit, values }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            fullWidth={true}
                            maxWidth="sm"
                            onClose={handleClose}
                            baseId={parentId}
                            title={app.name}
                            actions={
                                <>
                                    <Button
                                        id={build(parentId, ids.CANCEL_BTN)}
                                        onClick={handleClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(parentId, ids.SAVE_BTN)}
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("done")}
                                    </Button>
                                </>
                            }
                        >
                            <Field
                                name={"name"}
                                label={t("name")}
                                id={build(parentId, ids.PUBLISH.NAME)}
                                validate={(value) =>
                                    validateAppName(
                                        appsConstants.APP_NAME_RESTRICTED_STARTING_CHARS,
                                        appsConstants.APP_NAME_RESTRICTED_CHARS,
                                        value,
                                        t
                                    )
                                }
                                required={true}
                                component={FormTextField}
                            />
                            <Field
                                name={"description"}
                                label={t("descriptionLabel")}
                                id={build(parentId, ids.PUBLISH.DESCRIPTION)}
                                required={true}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name="testData"
                                id={build(parentId, ids.PATH)}
                                acceptedType={ResourceTypes.FOLDER}
                                label={t("testDataLocation")}
                                component={InputSelector}
                                required={true}
                            />
                            <Field
                                name={"inputDesc"}
                                label={t("inputDescLabel")}
                                id={build(parentId, ids.PUBLISH.INPUT)}
                                required={true}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name={"parameterDesc"}
                                label={t("parameterDescLabel")}
                                id={build(parentId, ids.PUBLISH.PARAMS)}
                                required={true}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name={"outputDesc"}
                                label={t("outputDescLabel")}
                                id={build(parentId, ids.PUBLISH.OUTPUT)}
                                required={true}
                                component={FormMultilineTextField}
                            />
                            <Typography>{t("attributionLinks")}</Typography>
                            <FieldArray
                                name="links"
                                render={(arrayHelpers) => (
                                    <Grid container spacing={3}>
                                        {values.links &&
                                        values.links.length > 0 ? (
                                            values.links.map((link, index) => (
                                                <>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        key={build(
                                                            parentId,
                                                            ids.PUBLISH.LINK,
                                                            index
                                                        )}
                                                    >
                                                        <Field
                                                            id={build(
                                                                parentId,
                                                                ids.PUBLISH
                                                                    .LINK,
                                                                index
                                                            )}
                                                            name={`links.${index}`}
                                                            component={
                                                                FormTextField
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={3}
                                                        key={build(
                                                            parentId,
                                                            ids.PUBLISH.LINK,
                                                            index,
                                                            ids.PUBLISH
                                                                .LINK_DEL_BTN
                                                        )}
                                                    >
                                                        <IconButton
                                                            id={build(
                                                                parentId,
                                                                ids.PUBLISH
                                                                    .LINK,
                                                                index,
                                                                ids.PUBLISH
                                                                    .LINK_DEL_BTN
                                                            )}
                                                            onClick={() =>
                                                                arrayHelpers.remove(
                                                                    index
                                                                )
                                                            } // remove a link from the list
                                                        >
                                                            <Remove />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={3}
                                                        key={build(
                                                            parentId,
                                                            ids.PUBLISH.LINK,
                                                            index,
                                                            ids.PUBLISH
                                                                .LINK_ADD_BTN
                                                        )}
                                                    >
                                                        <IconButton
                                                            id={build(
                                                                parentId,
                                                                ids.PUBLISH
                                                                    .LINK,
                                                                index,
                                                                ids.PUBLISH
                                                                    .LINK_ADD_BTN
                                                            )}
                                                            onClick={() =>
                                                                arrayHelpers.insert(
                                                                    index,
                                                                    ""
                                                                )
                                                            } // insert an empty string at a position
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                    </Grid>
                                                </>
                                            ))
                                        ) : (
                                            <Grid item xs={12}>
                                                <Button
                                                    onClick={() =>
                                                        arrayHelpers.push("")
                                                    }
                                                    variant="outlined"
                                                >
                                                    {t("addLink")}
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
