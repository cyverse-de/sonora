/**
 * @author sriram
 *
 * A dialog that allows users to apply metadata in bulk to children of a folder
 * from a metadata csv file
 *
 */

import React from "react";
import { useMutation } from "react-query";
import { useTranslation } from "i18n";
import { Field, Form, Formik } from "formik";

import { build, announce, AnnouncerConstants } from "@cyverse-de/ui-lib";

import ids from "./ids";
import constants from "../../constants";
import { nonEmptyField } from "components/utils/validations";
import DEDialog from "components/utils/DEDialog";
import { applyBulkMetadataFromFile } from "serviceFacades/metadata";

import { Button, CircularProgress } from "@material-ui/core";
import FileInput from "components/apps/launch/params/FileInput";

export default function ApplyBulkMetadataDialog(props) {
    const { open, handleClose, destFolder } = props;
    const { t } = useTranslation("metadata");
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18nUtil } = useTranslation("util");

    const baseId = "BULK";
    const [applyMetadata, { status: bulkStatus }] = useMutation(
        applyBulkMetadataFromFile,
        {
            onSuccess: () => {
                announce({
                    text: "Metadata successfully applied.",
                    variant: AnnouncerConstants.INFO,
                });
                handleClose();
            },
            onError: (error) => console.log("error=>" + error),
        }
    );

    const handleSubmit = (values) => {
        console.log(JSON.stringify(values));
        applyMetadata({ sourceFile: values.metadataFile, destFolder });
    };

    return (
        <Formik
            initialValues={{
                metadataFile: "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
        >
            {({ handleSubmit, values }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            maxWidth="sm"
                            onClose={handleClose}
                            baseId={baseId}
                            title="Apply Bulk Metadata"
                            actions={
                                <>
                                    <Button
                                        id={build(baseId, ids.CANCEL_BUTTON)}
                                        onClick={handleClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(baseId, ids.COPY_BUTTON)}
                                        type="submit"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("done")}
                                    </Button>
                                </>
                            }
                        >
                            {bulkStatus === constants.LOADING && (
                                <CircularProgress
                                    size={30}
                                    thickness={5}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                    }}
                                />
                            )}
                            <Field
                                name="metadataFile"
                                label="Select the file containing metadata"
                                id={build(baseId, ids.SELECTED_RESOURCES)}
                                required={true}
                                component={FileInput}
                                validate={(value) =>
                                    nonEmptyField(value, i18nUtil)
                                }
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}
