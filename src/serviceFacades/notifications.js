/**
 * @author psarando, flynn
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_MESSAGES_QUERY_KEY = "fetchNotificationsMessagesKey";
const NOTIFICATIONS_MARK_ALL_SEEN_KEY = "markAllSeenKey";
const ACTIVE_ALERTS_QUERY_KEY = "fetchActiveAlerts";

function getNotifications({ filter, orderBy, order, limit, offset }) {
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

function allAlerts() {
    return callApi({
        endpoint: "/api/alerts/all",
        method: "GET",
    });
}

function activeAlerts() {
    return callApi({
        endpoint: "/api/alerts/active",
        method: "GET",
    });
}

function addAlert(alert_spec) {
    return callApi({
        endpoint: "/api/admin/alerts",
        method: "POST",
        body: alert_spec,
    });
}

function removeAlert(alert_spec) {
    return callApi({
        endpoint: "/api/admin/alerts",
        method: "DELETE",
        body: alert_spec,
    });
}

export {
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
    NOTIFICATIONS_MARK_ALL_SEEN_KEY,
    ACTIVE_ALERTS_QUERY_KEY,
    deleteNotifications,
    getNotifications,
    markSeen,
    markAllSeen,
    allAlerts,
    activeAlerts,
    addAlert,
    removeAlert,
};
