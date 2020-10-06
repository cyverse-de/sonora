/**
 * @author aramsey
 *
 * A table meant for showing all the users with resource permissions in the
 * sharing dialog
 */
import React, { useMemo } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSortBy, useTable } from "react-table";

import { useTranslation } from "i18n";
import { groupName, isGroup } from "./util";
import ids from "./ids";
import SharingPermissionSelector from "./SharingPermissionSelector";
import styles from "./styles";

const useStyles = makeStyles(styles);

const getUserPrimaryText = (user) => {
    const { email, id } = user;
    return isGroup(user) ? groupName(user) : email || id;
};

const getUserSecondaryText = (user) => {
    return user.original.institution || user.original.description;
};

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
                Cell: ({ row, value }) => (
                    <ListItem classes={{ root: classes.listItem }}>
                        <ListItemText
                            primary={value}
                            secondary={getUserSecondaryText(row)}
                        />
                    </ListItem>
                ),
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
    const { getTableProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );

    return (
        <Table size="small" stickyHeader {...getTableProps()}>
            <TableHead>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <TableCell
                                padding="none"
                                {...column.getHeaderProps(
                                    column.getSortByToggleProps()
                                )}
                            >
                                {column.render("Header")}
                                <TableSortLabel
                                    active={column.isSorted}
                                    direction={
                                        column.isSortedDesc ? "desc" : "asc"
                                    }
                                />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <TableCell
                                        padding="none"
                                        {...cell.getCellProps()}
                                    >
                                        {cell.render("Cell")}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default UserTable;
