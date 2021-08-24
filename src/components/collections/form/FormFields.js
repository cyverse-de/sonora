/**
 * @author aramsey
 *
 * These are all the form fields for the form used for editing or creating
 * collections.
 * This also has a submission error message that displays above and below
 * the form when an error occurs.
 */
import React from "react";

import { Field, FieldArray } from "formik";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import FormTextField from "components/forms/FormTextField";
import { validateGroupName } from "components/teams/util";
import buildID from "components/utils/DebugIDUtil";

import Admins from "./Admins";
import CollectionApps from "./CollectionApps";
import ids from "../ids";
import { useTranslation } from "i18n";

function FormFields(props) {
    const { parentId, isAdmin, queryError, loading } = props;
    const { t } = useTranslation("collections");

    return (
        <>
            {queryError && (
                <ErrorTypographyWithDialog
                    errorMessage={queryError?.message}
                    errorObject={queryError?.object}
                />
            )}
            <Field
                name="name"
                label={t("collectionName")}
                id={buildID(parentId, ids.NAME)}
                InputProps={{
                    readOnly: !isAdmin,
                }}
                validate={(value) =>
                    validateGroupName(value, t, {
                        emptyNameKey: "emptyCollectionName",
                        invalidNameKey: "invalidCollectionName",
                    })
                }
                component={FormTextField}
            />
            <Field
                name="description"
                label={t("description")}
                id={buildID(parentId, ids.DESCRIPTION)}
                InputProps={{
                    readOnly: !isAdmin,
                }}
                component={FormMultilineTextField}
            />
            {isAdmin && (
                <FieldArray name="admins">
                    {(props) => (
                        <Admins
                            {...props}
                            isAdmin={isAdmin}
                            parentId={parentId}
                        />
                    )}
                </FieldArray>
            )}
            <FieldArray name="apps">
                {(props) => (
                    <CollectionApps
                        {...props}
                        loading={loading}
                        isAdmin={isAdmin}
                        parentId={parentId}
                    />
                )}
            </FieldArray>
            {queryError && (
                <ErrorTypographyWithDialog
                    errorMessage={queryError?.message}
                    errorObject={queryError?.object}
                />
            )}
        </>
    );
}

export default FormFields;
