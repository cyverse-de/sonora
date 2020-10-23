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
    return NotificationCategory[type?.replace(/\s/g, "_").toUpperCase()];
};

export default NotificationCategory;
