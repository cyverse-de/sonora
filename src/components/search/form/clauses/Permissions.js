import React from "react";

import { Grid, MenuItem } from "@material-ui/core";
import { Field, FieldArray, getIn } from "formik";

import { FormSelectField } from "components/forms/FormField";
import PermissionsModel from "components/models/Permissions";
import SubjectSearchField from "components/sharing/SubjectSearchField";
import buildID from "components/utils/DebugIDUtil";
import { useTranslation } from "i18n";
import ids from "../ids";
import UserPanel from "./UserPanel";

const PERMISSIONS_TYPE = "permissions";
const PERMISSIONS_ARGS_DEFAULT = {
    permission: "read",
    permission_recurse: true, // e.g. a user has read if they have write or own
    users: [],
};

const removeEmptyPermissionVals = (clause) => {
    return clause.args.users?.length > 0 ? clause : null;
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
        <Grid container spacing={1}>
            <Grid item>
                <Field
                    name={permissionFieldName}
                    id={buildID(parentId, ids.PERMISSION_VALUE)}
                    fullWidth={false}
                    component={FormSelectField}
                >
                    {Object.values(PermissionsModel).map(
                        (permission, index) => (
                            <MenuItem key={index} value={permission}>
                                {t(permission)}
                            </MenuItem>
                        )
                    )}
                </Field>
            </Grid>
            <Grid item sm={12}>
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
            </Grid>
        </Grid>
    );
}

export default Permissions;
export {
    PERMISSIONS_ARGS_DEFAULT,
    PERMISSIONS_TYPE,
    removeEmptyPermissionVals,
};
