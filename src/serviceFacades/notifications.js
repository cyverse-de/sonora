/**
 * @author flynn
 *
 */
import callApi from "../common/callApi";

const NOTIFICATIONS_KEY = "fetchNotificatons";


function getNotifications() {
    return callApi({
        endpoint: "/api/notifications/last-ten-messages",
        method: "GET",
    });
}

export {
    getNotifications,
    NOTIFICATIONS_KEY,
};
