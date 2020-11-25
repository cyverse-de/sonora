/**
 * @author psarando, flynn
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_MESSAGES_QUERY_KEY = "fetchNotificationsMessagesKey";

function getNotifications(key, { filter, orderBy, order, limit, offset }) {
    return callApi({
        endpoint: "/api/notifications/messages",
        method: "GET",
        params: {
            filter,
            sortField: orderBy,
            sortDir: order.toUpperCase(),
            limit,
            offset,
        },
    });
}

function markSeen(ids) {
    return callApi({
        endpoint: "/api/notifications/seen",
        method: "POST",
        body: { uuids: ids },
    });
}

function deleteNotifications(ids) {
    return callApi({
        endpoint: "/api/notifications/delete",
        method: "POST",
        body: { uuids: ids },
    });
}

export {
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
    deleteNotifications,
    getNotifications,
    markSeen,
};
