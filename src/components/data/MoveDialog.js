/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */
import React from "react";

import { Field, Form, Formik } from "formik";

import { useTranslation } from "react-i18next";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import DEDialog from "components/utils/DEDialog";
import { Button, Typography } from "@material-ui/core";

function MoveDialog(props) {
    const { path, open, selectedResources, onClose } = props;

    const baseId = ids.CREATE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const handleMove = ({ dest, name }) => {
        console.log("handling move");
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ name: "", dest: path }}
            onSubmit={handleMove}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={i18nCommon("move")}
                            actions={
                                <>
                                    <Button
                                        id={build(baseId, ids.CANCEL_BTN)}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(baseId, ids.CREATE_BTN)}
                                        color="primary"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        {i18nCommon("move")}
                                    </Button>
                                </>
                            }
                        >
                            <Typography
                                variant="subtitle2"
                                style={{ marginTop: 16, marginBottom: 16 }}
                            >
                                Selected File(s) and Folder(s)
                            </Typography>
                            {selectedResources?.map((resource) => {
                                return (
                                    <Typography
                                        style={{
                                            marginTop: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {resource?.path}
                                    </Typography>
                                );
                            })}
                            <Field
                                startingPath={path}
                                name="dest"
                                id={build(baseId, ids.PATH)}
                                acceptedType={ResourceTypes.FOLDER}
                                label={t("moveDestination")}
                                component={InputSelector}
                                required={true}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default MoveDialog;
