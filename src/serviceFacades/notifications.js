/**
 * @author psarando, flynn
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_LAST_TEN_KEY = "fetchNotificatons";
const NOTIFICATIONS_MESSAGES_QUERY_KEY = "fetchNotificationsMessagesKey";

function getLastTenNotifications() {
    return callApi({
        endpoint: "/api/notifications/last-ten-messages",
        method: "GET",
    });
}

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
    NOTIFICATIONS_LAST_TEN_KEY,
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
    deleteNotifications,
    getLastTenNotifications,
    getNotifications,
    markSeen,
};
