/**
 * A view to display a paginated listing of notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import ids from "../ids";
import NotificationToolbar from "../Toolbar";

import TableView from "./TableView";

import { useTranslation } from "i18n";

import notificationCategory from "components/models/notificationCategory";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
    deleteNotifications,
    getNotifications,
    markSeen,
} from "serviceFacades/notifications";

const NotificationView = (props) => {
    const { baseDebugId, onMessageClicked, showErrorAnnouncer } = props;

    const [notifications, setNotifications] = React.useState({});
    const [offset, setOffset] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState(ids.CREATED_DATE);
    const [filter, setFilter] = React.useState(notificationCategory.all);
    const [markAsSeenEnabled, setMarkAsSeenEnabled] = React.useState(true);

    const [notificationsKey, setNotificationsKey] = React.useState(
        NOTIFICATIONS_MESSAGES_QUERY_KEY
    );
    const [
        notificationsMessagesQueryEnabled,
        setNotificationsMessagesQueryEnabled,
    ] = React.useState(false);

    const { t } = useTranslation("notifications");

    const { isFetching, error } = useQuery({
        queryKey: notificationsKey,
        queryFn: getNotifications,
        config: {
            enabled: notificationsMessagesQueryEnabled,
            onSuccess: setNotifications,
        },
    });

    React.useEffect(() => {
        setNotificationsKey([
            NOTIFICATIONS_MESSAGES_QUERY_KEY,
            { filter, orderBy, order, limit: rowsPerPage, offset },
        ]);
        setNotificationsMessagesQueryEnabled(true);
    }, [
        filter,
        offset,
        order,
        orderBy,
        rowsPerPage,
        setNotificationsKey,
        setNotificationsMessagesQueryEnabled,
    ]);

    const [markSeenMutation, { isLoading: markSeenLoading }] = useMutation(
        markSeen,
        {
            onSuccess: () => {
                // TODO update unseen count somehow
                const newPage = {
                    ...notifications,
                    messages: notifications.messages.map((n) =>
                        selected.includes(n.message.id)
                            ? { ...n, seen: true }
                            : n
                    ),
                };

                setMarkAsSeenEnabled(false);
                setNotifications(newPage);
                queryCache.setQueryData(notificationsKey, newPage);
            },
            onError: (error) => {
                showErrorAnnouncer(
                    t("errorMarkAsSeen", {
                        count: selected.length,
                    }),
                    error
                );
            },
        }
    );

    const [
        deleteNotificationsMutation,
        { isLoading: deleteLoading },
    ] = useMutation(deleteNotifications, {
        onSuccess: () =>
            queryCache.invalidateQueries(NOTIFICATIONS_MESSAGES_QUERY_KEY),
        onError: (error) => {
            showErrorAnnouncer(
                t("errorNotificationDelete", {
                    count: selected.length,
                }),
                error
            );
        },
    });

    const handleMarkSeenClick = () => {
        markSeenMutation(selected);
    };

    const handleDeleteClick = () => {
        deleteNotificationsMutation(selected);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const onSelectionChanged = (newSelected) => {
        setSelected(newSelected);
        setMarkAsSeenEnabled(
            !notifications.messages.find(
                (n) => newSelected.includes(n.message.id) && n.seen
            )
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
                data={notifications?.messages}
                error={error}
                loading={isFetching || markSeenLoading || deleteLoading}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                selected={selected}
                total={parseInt(notifications?.total)}
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

export default withErrorAnnouncer(NotificationView);
