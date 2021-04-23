/**
 *
 * A dialog thru which users can request to make their app public
 *
 * @author sriram
 *
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";
import { Field, FieldArray, Form, Formik } from "formik";
import { useQuery, useMutation, queryCache } from "react-query";

import ids from "./ids";

import appsConstants from "./constants";

import {
    build,
    FormCheckbox,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import DEDialog from "components/utils/DEDialog";
import InputSelector from "components/apps/launch/InputSelector";
import ResourceTypes from "components/models/ResourceTypes";
import { validateAppName } from "components/apps/utils";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { Skeleton } from "@material-ui/lab";
import { Add, Delete } from "@material-ui/icons";
import {
    Button,
    CircularProgress,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";

export default function PublishAppDialog(props) {
    const { open, app, handleClose } = props;
    const [links, setLinks] = useState([]);
    const { t } = useTranslation("apps");
    const { t: i18nCommon } = useTranslation("common");
    const parentId = "publishDlg";
    const handleSubmit = (values) => {
        console.log("values=>" + JSON.stringify(values));
    };
    return (
        <Formik
            initialValues={{}}
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
                                id={build(parentId, ids.ADMIN_DETAILS.NAME)}
                                validate={(value) =>
                                    validateAppName(
                                        appsConstants.APP_NAME_RESTRICTED_STARTING_CHARS,
                                        appsConstants.APP_NAME_RESTRICTED_CHARS,
                                        value,
                                        t
                                    )
                                }
                                component={FormTextField}
                            />
                            <Field
                                name={"description"}
                                label={t("descriptionLabel")}
                                id={build(
                                    parentId,
                                    ids.ADMIN_DETAILS.DESCRIPTION
                                )}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name="testData"
                                id={build(parentId, ids.PATH)}
                                acceptedType={ResourceTypes.FOLDER}
                                label={t("newFileLocation")}
                                component={InputSelector}
                                required={true}
                            />
                            <Field
                                name={"inputDesc"}
                                label={t("inputDescLabel")}
                                id={build(
                                    parentId,
                                    ids.ADMIN_DETAILS.DESCRIPTION
                                )}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name={"parameterDesc"}
                                label={t("parameterDescLabel")}
                                id={build(
                                    parentId,
                                    ids.ADMIN_DETAILS.DESCRIPTION
                                )}
                                component={FormMultilineTextField}
                            />
                            <Field
                                name={"outputDesc"}
                                label={t("parameterDescLabel")}
                                id={build(
                                    parentId,
                                    ids.ADMIN_DETAILS.DESCRIPTION
                                )}
                                component={FormMultilineTextField}
                            />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography>Link(s)</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <FieldArray
                                                name="links"
                                                render={(arrayHelpers) => (
                                                    <div>
                                                        {values.links &&
                                                        values.links.length >
                                                            0 ? (
                                                            values.links.map(
                                                                (
                                                                    link,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <Field
                                                                            name={`link.${index}`}
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                arrayHelpers.remove(
                                                                                    index
                                                                                )
                                                                            } // remove a link from the list
                                                                        >
                                                                            -
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                arrayHelpers.insert(
                                                                                    index,
                                                                                    ""
                                                                                )
                                                                            } // insert an empty string at a position
                                                                        >
                                                                            +
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    arrayHelpers.push(
                                                                        ""
                                                                    )
                                                                }
                                                            >
                                                                {/* show this when user has removed all friends from the list */}
                                                                Add Link
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
