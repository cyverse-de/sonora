/**
 * A view to display a paginated listing of notification messages.
 *
 * @author Sriram, psarando
 *
 **/
import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import constants from "../../../constants";

import ids from "../ids";
import NotificationToolbar from "../Toolbar";

import TableView from "./TableView";

import { useTranslation } from "i18n";

import NotificationCategory from "components/models/NotificationCategory";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
    deleteNotifications,
    getNotifications,
    markSeen,
} from "serviceFacades/notifications";

import buildID from "components/utils/DebugIDUtil";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const NotificationView = (props) => {
    const { baseDebugId, showErrorAnnouncer } = props;

    const [notifications, setNotifications] = React.useState({});
    const [offset, setOffset] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(100);
    const [selected, setSelected] = React.useState([]);
    const [order, setOrder] = React.useState(constants.SORT_DESCENDING);
    const [orderBy, setOrderBy] = React.useState("timestamp");
    const [filter, setFilter] = React.useState(NotificationCategory.ALL);
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
            onSuccess: (resp) => {
                trackIntercomEvent(
                    IntercomEvents.VIEWED_NOTIFICATIONS,
                    notificationsKey[1]
                );
                setNotifications(resp);
            },
        },
    });

    React.useEffect(() => {
        setNotificationsKey([
            NOTIFICATIONS_MESSAGES_QUERY_KEY,
            {
                filter: filter === NotificationCategory.ALL ? null : filter,
                orderBy,
                order,
                limit: rowsPerPage,
                offset,
            },
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

    React.useEffect(() => {
        setMarkAsSeenEnabled(
            notifications?.messages &&
                !notifications.messages.find(
                    (n) => selected.includes(n.message.id) && n.seen
                )
        );
    }, [notifications, selected, setMarkAsSeenEnabled]);

    const [markSeenMutation] = useMutation(markSeen, {
        onSuccess: () => {
            // TODO update unseen count somehow
        },
        onError: (error) => {
            showErrorAnnouncer(
                t("errorMarkAsSeen", {
                    count: selected.length,
                }),
                error
            );

            queryCache.invalidateQueries(notificationsKey);
        },
    });

    const [deleteNotificationsMutation, { isLoading: deleteLoading }] =
        useMutation(deleteNotifications, {
            onSuccess: () => {
                queryCache.invalidateQueries(NOTIFICATIONS_MESSAGES_QUERY_KEY);
                setSelected([]);
            },
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

        const newPage = {
            ...notifications,
            messages: notifications.messages.map((n) =>
                selected.includes(n.message.id) ? { ...n, seen: true } : n
            ),
        };

        setMarkAsSeenEnabled(false);
        setNotifications(newPage);
        queryCache.setQueryData(notificationsKey, newPage);
    };

    const handleDeleteClick = () => {
        deleteNotificationsMutation(selected);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const onRefreshClicked = () => {
        queryCache.invalidateQueries(notificationsKey);
    };

    const baseId = buildId(baseDebugId, ids.NOTIFICATION_VIEW);

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
                onRefreshClicked={onRefreshClicked}
            />
            <TableView
                baseId={baseId}
                data={notifications?.messages}
                error={error}
                loading={isFetching || deleteLoading}
                order={order}
                orderBy={orderBy}
                rowsPerPage={rowsPerPage}
                selected={selected}
                total={parseInt(notifications?.total)}
                setOffset={setOffset}
                setOrder={setOrder}
                setOrderBy={setOrderBy}
                setRowsPerPage={setRowsPerPage}
                setSelected={setSelected}
            />
        </>
    );
};

export default withErrorAnnouncer(NotificationView);
