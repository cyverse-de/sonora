import React from "react";

import {
    build,
    FormCheckbox,
    FormMultilineTextField,
    FormTextField,
} from "@cyverse-de/ui-lib";
import { Field, FieldArray } from "formik";

import { validateGroupName } from "../util";
import ids from "../ids";
import { useTranslation } from "i18n";
import Members from "./Members";
import HelpIconButton from "./HelpIconButton";

function FormFields(props) {
    const { parentId, isAdmin, hasRead } = props;
    const { t } = useTranslation("teams");
    return (
        <>
            <Field
                name="name"
                label={t("teamName")}
                id={build(parentId, ids.EDIT_TEAM.NAME)}
                InputProps={{
                    readOnly: !isAdmin,
                }}
                validate={(value) => validateGroupName(value, t)}
                component={FormTextField}
            />
            <Field
                name="description"
                label={t("teamDesc")}
                id={build(parentId, ids.EDIT_TEAM.DESCRIPTION)}
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
                        id={build(parentId, ids.EDIT_TEAM.PUBLIC_PRIVILEGES)}
                        component={FormCheckbox}
                    />
                    <HelpIconButton
                        parentId={build(
                            parentId,
                            ids.EDIT_TEAM.PUBLIC_PRIVILEGES
                        )}
                        message={t("publicTeamHelp")}
                        color="secondary"
                    />
                </div>
            )}
            {hasRead && (
                <FieldArray
                    name="privileges"
                    render={(props) => (
                        <Members
                            {...props}
                            isAdmin={isAdmin}
                            hasRead={hasRead}
                            parentId={parentId}
                        />
                    )}
                />
            )}
        </>
    );
}

export default FormFields;
