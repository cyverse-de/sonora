/**
 * A view to display a paginated list of notifications in DE notification window.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import classnames from "classnames";

import ids from "../ids";
import styles from "../styles";
import NotificationToolbar from "../Toolbar";

import { useTranslation } from "i18n";

import notificationCategory from "components/models/notificationCategory";

import TableLoading from "components/utils/TableLoading";

import {
    DECheckbox,
    EnhancedTableHead,
    formatDate,
    TablePaginationActions,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

const getColumns = (t) => [
    {
        id: ids.CATEGORY,
        key: ids.CATEGORY,
        name: t("category"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.MESSAGE,
        key: ids.MESSAGE,
        name: t("message"),
        numeric: false,
        enableSorting: false,
    },
    {
        id: ids.CREATED_DATE,
        key: ids.CREATED_DATE,
        name: t("created_date"),
        numeric: false,
        enableSorting: true,
    },
];

function Message(props) {
    const { className, message, onMessageClicked } = props;

    return (
        <TableCell className={className}>
            <Typography onClick={(event) => onMessageClicked(message)}>
                {message.text}
            </Typography>
        </TableCell>
    );
}

const NotificationView = (props) => {
    const {
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
    const [orderBy, setOrderBy] = React.useState(ids.CREATED_DATE);
    const [filter, setFilter] = React.useState(notificationCategory.all);
    const [markAsSeenEnabled, setMarkAsSeenEnabled] = React.useState(true);

    const classes = useStyles();

    const { t } = useTranslation("notifications");
    const columnData = getColumns(t);

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

    const handleMarkSeenClick = () => {
        setLoading(true);

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
                setMarkAsSeenEnabled(false);
                setLoading(false);
            },
            (errorCode, errorMessage) => {
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
        setMarkAsSeenEnabled(
            !data.find((n) => newSelected.includes(n.message.id) && n.seen)
        );
    };

    const handleSelectAllClick = (event, checked) => {
        setSelected(
            checked && !selected.length ? data.map((n) => n.message.id) : []
        );
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

    const hasSelection = selected.length > 0;

    return (
        <>
            <NotificationToolbar
                baseDebugId={baseDebugId}
                filter={filter}
                onFilterChange={handleFilterChange}
                markAsSeenEnabled={hasSelection && markAsSeenEnabled}
                deleteEnabled={hasSelection}
                onMarkSeenClicked={handleMarkSeenClick}
                onDeleteClicked={handleDeleteClick}
            />
            <Table stickyHeader={true} size="small">
                {loading ? (
                    <TableLoading
                        baseId={baseDebugId}
                        numColumns={columnData.length + 1}
                        numRows={25}
                    />
                ) : (
                    <TableBody>
                        {data.map((n) => {
                            const isSelected = selected.includes(n.message.id);

                            const className = n.seen
                                ? null
                                : classes.unSeenNotificationBackground;

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
                                    <TableCell
                                        className={className}
                                        padding="checkbox"
                                    >
                                        <DECheckbox checked={isSelected} />
                                    </TableCell>
                                    <TableCell className={className}>
                                        {
                                            notificationCategory[
                                                n.type
                                                    .replace(/\s/g, "_")
                                                    .toLowerCase()
                                            ]
                                        }
                                    </TableCell>
                                    <Message
                                        className={classnames(
                                            classes.notification,
                                            className
                                        )}
                                        message={n.message}
                                        onMessageClicked={onMessageClicked}
                                    />
                                    <TableCell className={className}>
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
            <TablePagination
                colSpan={3}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[25, 100, 500, 1000]}
            />
        </>
    );
};

export default NotificationView;
