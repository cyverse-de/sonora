/**
 * @author aramsey
 *
 * A component that allows a user to view/edit the community admins
 *
 * Note that an admin can never remove themselves from a community. This is
 * to prevent an admin from accidentally losing the ability to modify their
 * own community
 */

import React, { useMemo } from "react";

import { FormControlLabel } from "@material-ui/core";
import { Field, getIn } from "formik";

import SubjectSearchField from "components/sharing/SubjectSearchField";
import { SubjectTableCell } from "components/sharing/UserTable";
import { getUserPrimaryText } from "components/sharing/util";
import BasicTable from "components/table/BasicTable";
import HelpIconButton from "components/teams/form/HelpIconButton";
import SimpleExpansionPanel from "components/tools/SimpleExpansionPanel";
import { useUserProfile } from "contexts/userProfile";
import buildID from "components/utils/DebugIDUtil";
import DeleteButton from "components/utils/DeleteButton";
import { useTranslation } from "i18n";
import ids from "../ids";

function Admins(props) {
    const {
        parentId,
        isAdmin,
        push,
        remove,
        form: { values },
        name,
    } = props;
    const { t } = useTranslation(["communities", "sharing"]);

    const [userProfile] = useUserProfile();
    const username = userProfile?.id;

    const adminList = getIn(values, name);

    const adminExists = (subject) => {
        const exists = adminList.filter((admin) => admin.id === subject.id);
        return exists?.length > 0;
    };

    const addAdmin = (subject) => {
        if (!adminExists(subject)) {
            push(subject);
        }
    };

    const baseId = buildID(parentId, ids.ADMIN_LIST);

    const columns = useMemo(() => {
        const isSelf = (subject) => {
            return subject.id === username;
        };

        const getRowId = (row) => {
            return buildID(baseId, row.original.id);
        };

        return [
            {
                Header: t("sharing:user"),
                accessor: getUserPrimaryText,
                Cell: ({ row }) => {
                    return (
                        <Field name={`${name}.${row.index}`}>
                            {({ field: { value } }) => {
                                return <SubjectTableCell subject={value} />;
                            }}
                        </Field>
                    );
                },
            },
            {
                Header: "",
                accessor: "id",
                Cell: ({ row }) => {
                    const subject = row.original;
                    const rowId = getRowId(row);
                    if (isAdmin && !isSelf(subject)) {
                        return (
                            <DeleteButton
                                baseId={rowId}
                                ariaLabel={t("remove")}
                                onClick={() => {
                                    remove(row.index);
                                }}
                                component="IconButton"
                            />
                        );
                    }
                    return null;
                },
            },
        ];
    }, [baseId, isAdmin, name, remove, t, username]);

    return (
        <SimpleExpansionPanel
            header={
                <FormControlLabel
                    aria-label={t("communityAdmins")}
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    labelPlacement="start"
                    control={
                        <HelpIconButton
                            parentId={baseId}
                            message={t("adminHelpMessage")}
                            size="small"
                            color="secondary"
                        />
                    }
                    label={t("communityAdmins")}
                />
            }
            defaultExpanded={true}
            parentId={baseId}
        >
            {isAdmin && (
                <SubjectSearchField
                    baseId={buildID(baseId, ids.SUBJECT_SEARCH)}
                    onUserSelected={addAdmin}
                />
            )}

            <BasicTable columns={columns} data={adminList} sortable />
        </SimpleExpansionPanel>
    );
}

export default Admins;
