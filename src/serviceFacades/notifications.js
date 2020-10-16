/**
 * @author flynn
 *
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_LAST_TEN_KEY = "fetchNotificatons";

function getLastTenNotifications() {
    return callApi({
        endpoint: "/api/notifications/last-ten-messages",
        method: "GET",
    });
}

export { getLastTenNotifications, NOTIFICATIONS_LAST_TEN_KEY };
