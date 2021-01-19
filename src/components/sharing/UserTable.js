/**
 * @author aramsey
 *
 * A table meant for showing all the users with resource permissions in the
 * sharing dialog
 */
import React, { useMemo } from "react";

import { build } from "@cyverse-de/ui-lib";
import { ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useTranslation } from "i18n";
import { getUserPrimaryText, getUserSecondaryText, isGroup } from "./util";
import ids from "./ids";
import SharingPermissionSelector from "./SharingPermissionSelector";
import styles from "./styles";
import BasicTable from "../utils/BasicTable";

const useStyles = makeStyles(styles);

function UserTable(props) {
    const { userMap, baseId, onPermissionChange, onRemoveUser } = props;
    const classes = useStyles();
    const { t } = useTranslation("sharing");

    const data = React.useMemo(() => Object.values(userMap), [userMap]);
    const columns = useMemo(
        () => [
            {
                Header: t("user"),
                accessor: getUserPrimaryText,
                Cell: ({ row, value }) => {
                    const user = row.original;
                    return (
                        <ListItem classes={{ root: classes.listItem }}>
                            <ListItemText
                                primary={value}
                                secondary={
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {!isGroup(user) && (
                                            <>
                                                {t("username", {
                                                    id: user.id,
                                                })}
                                                <br />
                                            </>
                                        )}
                                        {getUserSecondaryText(user)}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    );
                },
            },
            {
                Header: t("permission"),
                accessor: (row) => row.displayPermission,
                Cell: ({ row, value }) => {
                    const user = row.original;
                    return (
                        <SharingPermissionSelector
                            baseId={build(
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
        [baseId, t, onPermissionChange, onRemoveUser, classes.listItem]
    );

    return <BasicTable columns={columns} data={data} sortable />;
}

export default UserTable;
