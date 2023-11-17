/**
 * @author aramsey
 *
 * A table meant for showing all the users with resource permissions in the
 * sharing dialog
 */
import React, { useMemo } from "react";

import buildID from "components/utils/DebugIDUtil";
import { ListItem, ListItemText, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useTranslation } from "i18n";
import { getUserPrimaryText, getUserSecondaryText, isGroup } from "./util";
import ids from "./ids";
import SharingPermissionSelector from "./SharingPermissionSelector";
import styles from "./styles";
import BasicTable from "../table/BasicTable";

const useStyles = makeStyles(styles);

function SubjectTableCell({ subject }) {
    const classes = useStyles();
    const { t } = useTranslation("sharing");

    return (
        <ListItem classes={{ root: classes.listItem }}>
            <ListItemText
                primary={getUserPrimaryText(subject)}
                secondary={
                    <Typography variant="body2" color="textSecondary">
                        {!isGroup(subject) && (
                            <>
                                {t("username", {
                                    id: subject.id,
                                })}
                                <br />
                            </>
                        )}
                        {getUserSecondaryText(subject)}
                    </Typography>
                }
            />
        </ListItem>
    );
}

function UserTable(props) {
    const { userMap, baseId, onPermissionChange, onRemoveUser } = props;
    const { t } = useTranslation("sharing");

    const data = React.useMemo(() => Object.values(userMap), [userMap]);
    const columns = useMemo(
        () => [
            {
                Header: t("user"),
                accessor: getUserPrimaryText,
                Cell: ({ row, value }) => {
                    const user = row.original;
                    return <SubjectTableCell subject={user} />;
                },
            },
            {
                Header: t("permission"),
                accessor: (row) => row.displayPermission,
                Cell: ({ row, value }) => {
                    const user = row.original;
                    return (
                        <SharingPermissionSelector
                            baseId={buildID(
                                baseId,
                                user.id,
                                ids.PERMISSION_SELECTOR
                            )}
                            currentPermission={value}
                            onPermissionChange={(updatedPermission) =>
                                onPermissionChange(user, updatedPermission)
                            }
                            onRemoveSelected={() => onRemoveUser(user)}
                        />
                    );
                },
            },
        ],
        [baseId, t, onPermissionChange, onRemoveUser]
    );

    return <BasicTable columns={columns} data={data} sortable />;
}

export default UserTable;
export { SubjectTableCell };
