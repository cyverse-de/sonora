/**
 * A view to display a paginated list of notifications in DE notification window.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import classnames from "classnames";

import exStyles from "../style";
import ids from "../ids";
import intlData from "../messages";
import NotificationToolbar from "../Toolbar";

import notificationCategory from "components/models/notificationCategory";

import TableLoading from "components/utils/TableLoading";

import {
    DECheckbox,
    EnhancedTableHead,
    formatDate,
    TablePaginationActions,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Typography,
    withStyles,
} from "@material-ui/core";

const columnData = [
    {
        id: ids.CATEGORY,
        name: "Category",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.MESSAGE,
        name: "Message",
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.CREATED_DATE,
        name: "Created Date",
        numeric: false,
        enableSorting: true,
    },
];

function Message(props) {
    const { message, seen, onMessageClicked, classes } = props;
    let className = seen
        ? classes.notification
        : classnames(
              classes.notification,
              classes.unSeenNotificationBackground
          );
    return (
        <TableCell padding="none" className={className}>
            <Typography onClick={(event) => onMessageClicked(message)}>
                {message.text}
            </Typography>
        </TableCell>
    );
}

const NotificationView = (props) => {
    const {
        classes,
        baseDebugId,
        onMessageClicked,
        getNotifications,
        onMarkAsSeenClicked,
        deleteNotifications,
    } = props;

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [total, setTotal] = React.useState(0);
    const [offset, setOffset] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState("Date");
    const [filter, setFilter] = React.useState(notificationCategory.all);
    const [markAsSeenDisabled, setMarkAsSeenDisabled] = React.useState(true);

    const fetchNotifications = React.useCallback(() => {
        setLoading(true);
        getNotifications(
            rowsPerPage,
            offset,
            filter,
            order,
            (notifications, total) => {
                setLoading(false);
                setData(notifications.messages);
                setTotal(total);
            },
            (errorCode, errorMessage) => {
                setLoading(false);
            }
        );
    }, [
        filter,
        getNotifications,
        offset,
        order,
        rowsPerPage,
        setData,
        setLoading,
        setTotal,
    ]);

    React.useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications, filter, offset, order, orderBy, page, rowsPerPage]);

    const handleRefreshClicked = () => {
        fetchNotifications();
    };

    const handleMarkSeenClick = () => {
        setLoading(true);
        setMarkAsSeenDisabled(true);
        onMarkAsSeenClicked(
            selected,
            () => {
                setData(
                    data.map((n) =>
                        selected.includes(n.message.id)
                            ? { ...n, seen: true }
                            : n
                    )
                );
                setLoading(false);
            },
            (errorCode, errorMessage) => {
                setMarkAsSeenDisabled(false);
                setLoading(false);
            }
        );
    };

    const handleDeleteClick = () => {
        setLoading(true);
        deleteNotifications(
            selected,
            () => {
                setLoading(false);
                fetchNotifications();
            },
            (errorCode, errorMessage) => {
                setLoading(false);
            }
        );
    };

    const handleChangePage = (event, page) => {
        setPage(page);
        setOffset(rowsPerPage * page);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    };

    const handleRowClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        setMarkAsSeenDisabled(
            !!data.find((n) => newSelected.includes(n.message.id) && n.seen)
        );
    };

    const handleSelectAllClick = (event, checked) => {
        setSelected(checked ? data.map((n) => n.message.id) : []);
    };

    const handleRequestSort = (event, property) => {
        let newOrder = "desc";

        if (orderBy === property && order === "desc") {
            newOrder = "asc";
        }

        setOrder(newOrder);
        setOrderBy(property);
    };

    const baseId = baseDebugId + ids.NOTIFICATION_VIEW;

    return (
        <div className={classes.container}>
            <NotificationToolbar
                baseDebugId={baseDebugId}
                filter={filter}
                onFilterChange={handleFilterChange}
                onRefreshClicked={handleRefreshClicked}
                markSeenDisabled={selected.length === 0 || markAsSeenDisabled}
                deleteDisabled={selected.length === 0}
                onMarkSeenClicked={handleMarkSeenClick}
                onDeleteClicked={handleDeleteClick}
            />
            <div className={classes.table}>
                <Table>
                    {loading ? (
                        <TableLoading
                            baseId={baseDebugId}
                            numColumns={4}
                            numRows={25}
                        />
                    ) : (
                        <TableBody>
                            {data.map((n) => {
                                const isSelected = selected.includes(
                                    n.message.id
                                );

                                return (
                                    <TableRow
                                        onClick={(event) =>
                                            handleRowClick(event, n.message.id)
                                        }
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        selected={isSelected}
                                        hover
                                        key={n.message.id}
                                    >
                                        <TableCell padding="checkbox">
                                            <DECheckbox checked={isSelected} />
                                        </TableCell>
                                        <TableCell>
                                            {
                                                notificationCategory[
                                                    n.type
                                                        .replace(/\s/g, "_")
                                                        .toLowerCase()
                                                ]
                                            }
                                        </TableCell>
                                        <Message
                                            message={n.message}
                                            seen={n.seen}
                                            onMessageClicked={onMessageClicked}
                                            classes={classes}
                                        />
                                        <TableCell>
                                            {formatDate(n.message.timestamp)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    )}
                    <EnhancedTableHead
                        selectable={true}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        columnData={columnData}
                        baseId={baseId}
                        rowsInPage={data.length}
                    />
                </Table>
            </div>
            <TablePagination
                colSpan={3}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[5, 100, 500, 1000]}
            />
        </div>
    );
};

export default withStyles(exStyles)(withI18N(NotificationView, intlData));
