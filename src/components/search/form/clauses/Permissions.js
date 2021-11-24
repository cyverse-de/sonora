import React from "react";

import { MenuItem } from "@material-ui/core";
import { Field, FieldArray, getIn } from "formik";

import { FormSelectField } from "components/forms/FormField";
import PermissionsModel from "components/models/Permissions";
import SubjectSearchField from "components/sharing/SubjectSearchField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";
import UserPanel from "./UserPanel";

const PERMISSIONS_TYPE = "permission";
const PERMISSIONS_ARGS_DEFAULT = {
    permission: "read",
    users: [],
};

function Permissions(props) {
    const {
        parentId,
        field: { name },
        form: { values },
    } = props;

    const { t } = useTranslation("search");

    const permissionFieldName = `${name}.permission`;
    const usersFieldName = `${name}.users`;

    const users = getIn(values, usersFieldName);

    return (
        <>
            <Field
                name={permissionFieldName}
                id={buildID(parentId, ids.PERMISSION_VALUE)}
                component={FormSelectField}
            >
                {Object.values(PermissionsModel).map((permission, index) => (
                    <MenuItem key={index} value={permission}>
                        {t(permission)}
                    </MenuItem>
                ))}
            </Field>
            <FieldArray
                name={usersFieldName}
                render={(arrayHelpers) => (
                    <>
                        <SubjectSearchField
                            baseId={buildID(
                                parentId,
                                ids.PERMISSION_USER_SEARCH
                            )}
                            onUserSelected={(user) =>
                                arrayHelpers.push(user.id)
                            }
                        />
                        <UserPanel
                            parentId={parentId}
                            users={users}
                            onDelete={(index) => arrayHelpers.remove(index)}
                        />
                    </>
                )}
            />
        </>
    );
}

export default Permissions;
export { PERMISSIONS_ARGS_DEFAULT, PERMISSIONS_TYPE };
