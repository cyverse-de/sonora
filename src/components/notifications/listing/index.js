/**
 * A view to display a paginated listing of notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import ids from "../ids";
import NotificationToolbar from "../Toolbar";

import TableView from "./TableView";

import notificationCategory from "components/models/notificationCategory";

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
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState(ids.CREATED_DATE);
    const [filter, setFilter] = React.useState(notificationCategory.all);
    const [markAsSeenEnabled, setMarkAsSeenEnabled] = React.useState(true);

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
    }, [fetchNotifications, filter, offset, order, orderBy, rowsPerPage]);

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

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const onSelectionChanged = (newSelected) => {
        setSelected(newSelected);
        setMarkAsSeenEnabled(
            !data.find((n) => newSelected.includes(n.message.id) && n.seen)
        );
    };

    const baseId = baseDebugId + ids.NOTIFICATION_VIEW;

    const hasSelection = selected.length > 0;

    return (
        <>
            <NotificationToolbar
                baseDebugId={baseId}
                filter={filter}
                onFilterChange={handleFilterChange}
                markAsSeenEnabled={hasSelection && markAsSeenEnabled}
                deleteEnabled={hasSelection}
                onMarkSeenClicked={handleMarkSeenClick}
                onDeleteClicked={handleDeleteClick}
            />
            <TableView
                baseId={baseId}
                data={data}
                loading={loading}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                selected={selected}
                total={total}
                onMessageClicked={onMessageClicked}
                onSelectionChanged={onSelectionChanged}
                setOffset={setOffset}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setRowsPerPage={setRowsPerPage}
            />
        </>
    );
};

export default NotificationView;
