import React from "react";

import { Field, getIn } from "formik";

import SubjectSearchField from "components/sharing/SubjectSearchField";
import buildID from "../../../utils/DebugIDUtil";
import ids from "../ids";
import UserPanel from "./UserPanel";

const OWNER_TYPE = "owner";
const OWNER_ARGS_DEFAULT = { owner: "" };

function Owner(props) {
    const {
        parentId,
        field: { name },
        form: { setFieldValue, values },
    } = props;

    const fieldName = `${name}.owner`;
    const baseId = buildID(parentId, ids.OWNER);

    const users = getIn(values, fieldName);

    return (
        <>
            <Field
                name={fieldName}
                baseId={baseId}
                onUserSelected={(user) => setFieldValue(fieldName, user.id)}
                component={SubjectSearchField}
            />
            <UserPanel
                parentId={parentId}
                users={users ? [users] : null}
                onDelete={() => setFieldValue(fieldName, "")}
            />
        </>
    );
}

export default Owner;
export { OWNER_ARGS_DEFAULT, OWNER_TYPE };
