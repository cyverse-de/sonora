import NotificationCategory from "../models/NotificationCategory";

export const ANALYSIS_EMAIL_TEMPLATE = "analysis_status_change";

export function getDisplayMessage(notification) {
    return notification.type.toLowerCase() ===
        NotificationCategory.DATA.toLowerCase() &&
        notification.email_template !== ANALYSIS_EMAIL_TEMPLATE
        ? notification.subject
        : notification.message.text;
}
