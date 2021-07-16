/**
 * @author aramsey
 *
 * These are all the form fields for the form used for editing or creating teams.
 * This also has a submission error message that displays above and below
 * the form when an error occurs.
 */
import React from "react";

import buildID from "components/utils/DebugIDUtil";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import FormTextField from "components/forms/FormTextField";
import FormCheckbox from "components/forms/FormCheckbox";

import { Field, FieldArray } from "formik";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import { validateGroupName } from "../util";
import ids from "../ids";
import { useTranslation } from "i18n";
import Members from "./Members";
import HelpIconButton from "./HelpIconButton";

function FormFields(props) {
    const { parentId, isAdmin, hasRead, saveError } = props;
    const { t } = useTranslation("teams");
    return (
        <>
            {saveError && (
                <ErrorTypographyWithDialog
                    errorMessage={saveError?.message}
                    errorObject={saveError?.object}
                />
            )}
            <Field
                name="name"
                label={t("teamName")}
                id={buildID(parentId, ids.EDIT_TEAM.NAME)}
                InputProps={{
                    readOnly: !isAdmin,
                }}
                validate={(value) => validateGroupName(value, t)}
                component={FormTextField}
            />
            <Field
                name="description"
                label={t("teamDesc")}
                id={buildID(parentId, ids.EDIT_TEAM.DESCRIPTION)}
                InputProps={{
                    readOnly: !isAdmin,
                }}
                component={FormMultilineTextField}
            />
            {isAdmin && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Field
                        name="isPublicTeam"
                        label={t("publicTeam")}
                        id={buildID(parentId, ids.EDIT_TEAM.PUBLIC_PRIVILEGES)}
                        component={FormCheckbox}
                    />
                    <HelpIconButton
                        parentId={buildID(
                            parentId,
                            ids.EDIT_TEAM.PUBLIC_PRIVILEGES
                        )}
                        message={t("publicTeamHelp")}
                        color="secondary"
                    />
                </div>
            )}
            {hasRead && (
                <FieldArray name="privileges">
                    {(props) => (
                        <Members
                            {...props}
                            isAdmin={isAdmin}
                            hasRead={hasRead}
                            parentId={parentId}
                        />
                    )}
                </FieldArray>
            )}
            {saveError && (
                <ErrorTypographyWithDialog
                    errorMessage={saveError?.message}
                    errorObject={saveError?.object}
                />
            )}
        </>
    );
}

export default FormFields;
