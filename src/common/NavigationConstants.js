/**
 * Constants that define navigation routes.
 * Warning: server/index.js expects each value to be a string.
 */
const NavigationConstants = {
    ADMIN: "admin",
    ADMIN_USER_PORTAL_USERS: "/administrative/users",
    ANALYSES: "analyses",
    APPS: "apps",
    COLLECTIONS: "collections",
    DASHBOARD: "dashboard",
    DATA: "data",
    DETAILS: "details",
    DOI: "doi",
    ERROR: "error",
    HELP: "help",
    INSTANT_LAUNCH: "instantlaunch",
    INSTANT_LAUNCHES: "instantlaunches",
    LOGIN: "login",
    LOGOUT: "logout",
    MORE: "more",
    NEW_APP: "/apps/create",
    NEW_WORKFLOW: "/workflows/create",
    NOTIFICATIONS: "notifications",
    NOTIFICATION_WS: "/websocket/notifications",
    REF_GENOMES: "refgenomes",
    RELAUNCH: "relaunch",
    SEARCH: "search",
    SETTINGS: "settings",
    SUBSCRIPTIONS: "subscriptions",
    TEAMS: "teams",
    TOOLS: "tools",
    VICE: "vice",
    YOUTUBE_EMBED_BASE: "https://youtu.be",
};

export const NavigationParams = {
    // This could be updated with more options in the future,
    // such as CONTENTS, DETAILS, or LISTING.
    VIEW: { METADATA: "metadata" },
};

export default NavigationConstants;
