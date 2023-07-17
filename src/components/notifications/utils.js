import NotificationCategory from "../models/NotificationCategory";
import { groupShortName } from "../teams/util";

export const ANALYSIS_EMAIL_TEMPLATE = "analysis_status_change";
export const ADDED_TO_TEAM = "added_to_team";
export const REQUEST_TO_JOIN = "team_join_request";
export const JOIN_TEAM_DENIED = "team_join_denial";

export function getDisplayMessage(notification) {
    switch (notification.type.toLowerCase()) {
        case NotificationCategory.DATA.toLowerCase():
            return notification.email_template !== ANALYSIS_EMAIL_TEMPLATE
                ? notification.subject
                : notification.message.text;

        case NotificationCategory.TEAM.toLowerCase():
            return notification.email_template === ADDED_TO_TEAM
                ? notification.message.text +
                      " " +
                      groupShortName(notification.payload.team_name)
                : notification.subject;

        default:
            return notification.message.text;
    }
}

export function isAnalysisNotification(notification) {
    return (
        NotificationCategory.ANALYSIS.toLowerCase() ===
        notification?.message?.type
    );
}

export function isViceNotification(notification) {
    return (
        isAnalysisNotification(notification) &&
        notification.message.payload?.interactive_urls?.length > 0
    );
}
