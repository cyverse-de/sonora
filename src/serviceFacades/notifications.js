/**
 * @author psarando, flynn
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_MESSAGES_QUERY_KEY = "fetchNotificationsMessagesKey";
const NOTIFICATIONS_MARK_ALL_SEEN_KEY = "markAllSeenKey";

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

function markAllSeen() {
    return callApi({
        endpoint: "/api/notifications/mark-all-seen",
        method: "POST",
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
    NOTIFICATIONS_MARK_ALL_SEEN_KEY,
    deleteNotifications,
    getNotifications,
    markSeen,
    markAllSeen,
};
