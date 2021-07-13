/**
 * @author sriram
 *
 *
 */
import React from "react";
import { useTranslation } from "i18n";
import { useQuery } from "react-query";

import ids from "../ids";
import {
    ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY,
    getAdminToolRequestDetails,
} from "serviceFacades/tools";

import { build, FormTextField } from "@cyverse-de/ui-lib";

import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { Field, Form, Formik } from "formik";
import { Button } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

function DetailsDialog(props) {
    const { open, parentId, requestId, onClose } = props;
    const { t } = useTranslation("tools");
    const { t: i18nCommon } = useTranslation("common");
    const [details, setDetails] = React.useState({
        name: "",
        description: "",
        test_data_path: "",
        source_url: "",
        version: "",
        documentation_url: "",
        cmd_line: "",
    });

    const { isFetching: isDetailsFetching, error: detailsFetchError } =
        useQuery({
            queryKey: [ADMIN_TOOL_REQUEST_DETAILS_QUERY_KEY, { id: requestId }],
            queryFn: getAdminToolRequestDetails,
            config: {
                enabled: requestId && open,
                onSuccess: (resp) => {
                    setDetails(resp);
                },
            },
        });
    const handleSubmit = (values) => {
        console.log(JSON.stringify(values));
    };
    return (
        <Formik
            initialValues={details}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit, values }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            fullWidth={true}
                            onClose={onClose}
                            id={parentId}
                            title="Details"
                            actions={
                                <>
                                    <Button
                                        id={build(parentId, ids.BUTTONS.CANCEL)}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(parentId, ids.BUTTONS.SAVE)}
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("ok")}
                                    </Button>
                                </>
                            }
                        >
                            {isDetailsFetching && (
                                <Skeleton
                                    animation="wave"
                                    variant="rect"
                                    height={800}
                                />
                            )}
                            {detailsFetchError && (
                                <ErrorTypographyWithDialog
                                    errorObject={detailsFetchError}
                                    errorMessage={t("requestDetailsFetchError")}
                                />
                            )}
                            {!detailsFetchError && !isDetailsFetching && (
                                <>
                                    <Field
                                        name="name"
                                        label={t("toolName")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.NAME
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="description"
                                        label={t("description")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.DESCRIPTION
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="source_url"
                                        label={t("source")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.SOURCE_URL
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="documentation_url"
                                        label={t("documentation_url")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.DOCUMENTATION_URL
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="test_data_path"
                                        label={t("testData")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.TEST_DATA_LINK
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="cmd_line"
                                        label={t("commandLine")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.COMMAND_LINE
                                        )}
                                        component={FormTextField}
                                    />
                                    <Field
                                        name="version"
                                        label={t("version")}
                                        id={build(
                                            parentId,
                                            ids.TOOL_REQUEST.VERSION
                                        )}
                                        component={FormTextField}
                                    />
                                </>
                            )}
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
export default DetailsDialog;
