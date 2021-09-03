/**
 * Notification Category types.
 *
 * Note that the order of these keys affects the order displayed in the listing
 * toolbar.
 */
const NotificationCategory = {
    ALL: "All",
    NEW: "New",
    ANALYSIS: "Analysis",
    DATA: "Data",
    TOOL_REQUEST: "Tool Request",
    APPS: "Apps",
    PERMANENT_ID_REQUEST: "Permanent ID Request",
    TEAM: "Team",
    COMMUNITY: "Community",
};

export const notificationTypeToCategory = (type) => {
    return type?.replace(/\s/g, "_");
};

export default NotificationCategory;
