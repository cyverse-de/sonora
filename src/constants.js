// Add global constants here.

const constants = {
    // The CyVerse page for DE. Not the DE base URL.
    CYVERSE_POLICY_URL: "https://cyverse.org/policies",

    CYVERSE_ABOUT_URL: "https://cyverse.org/about",
    OLD_DE_LINK: "https://legacy-de.cyverse.org",
    DEFAULT_USER_PORTAL_URL: "https://user.cyverse.org",
    SHARED_WITH_ME: "Shared With Me",
    APPS_SHARED_WITH_ME: "Shared with me",
    COMMUNITY_DATA: "Community Data",
    TRASH: "Trash",
    DATA_STORE_STORAGE_ID: "ds",
    DEFAULT_PAGE_SIZE: 100,
    PATH_SEPARATOR: "/",
    APPS_UNDER_DEV: "Apps under development",
    FAV_APPS: "Favorite Apps",
    MY_PUBLIC_APPS: "My public apps",
    FEATURED_APPS: "Featured Apps",
    HPC: "High-Performance Computing",
    BROWSE_ALL_APPS: "Browse All Apps",
    BROWSE_ALL_APPS_ID: "pppppppp-pppp-pppp-pppp-pppppppppppp",
    FEATURED_APPS_ID: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    MY_COLLECTIONS: "My Collections",
    APP_TYPE_EXTERNAL: "External",
    LOADING: "loading",
    NOTIFICATION_WS: "/websocket/notifications",
    ONE_GiB: 2 ** 30,
    WS_PROTOCOL: "ws://",
    WSS_PROTOCOL: "wss://",
    USER_PORTAL: "https://user.cyverse.org/register",
    USER_PORTAL_FAQ: "https://learning.cyverse.org/faq/#user-account",

    IMPORT_IRODS_METADATA_LINK:
        "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027072/Using+Metadata+in+the+DE#UsingMetadataintheDE-irodsMetadataImport",

    DEFAULT_USERNAME_SUFFIX: "iplantcollaborative.org",
    WEBSOCKET_MAX_CONNECTION_ATTEMPTS: 10,

    LOCAL_STORAGE: {
        DATA: {
            COLUMNS: "sonora.data.columns",
            PAGE_SIZE: "sonora.data.pageSize",
        },
        APPS: {
            PAGE_SIZE: "sonora.apps.pageSize",
        },
        ANALYSES: {
            PAGE_SIZE: "sonora.analyses.pageSize",
        },
        SUBSCRIPTIONS: {
            PAGE_SIZE: "sonora.subscriptions.pageSize",
        },
        TOOLS: {
            PAGE_SIZE: "sonora.tools.pageSize",
        },
    },

    CHROMATIC_IGNORE: "chromatic-ignore",
    AGAVE_SYSTEM_ID: "agave",
    SORT_ASCENDING: "asc",
    SORT_DESCENDING: "desc",

    HELP_DOCS: {
        APP_AND_TOOL_INFO:
            "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027152/Viewing+App+and+Tool+Information",
        APP_RATINGS_COMMENTS:
            "https://wiki.cyverse.org/wiki/display/DEmanual/Using+App+Ratings+and+App+Comments",
        APP_STATUS:
            "https://wiki.cyverse.org/wiki/x/6gGO#UsingtheAppsWindowandSubmittinganAnalysis-AppStatus",
        EXAMPLE_FILE:
            "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027163/Troubleshooting+an+Analysis#TroubleshootinganAnalysis-5.Checkistheappisfunctioningproperly",
        HPC_APPS: "https://cyverse.atlassian.net/wiki/x/6QltDg",
        LOG_FILES:
            "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027163/Troubleshooting+an+Analysis#TroubleshootinganAnalysis-2.Checkthelogfiles",
        SCI_INFORMATICIANS: "https://cyverse.org/team#science",
        SHARE_ANALYSIS:
            "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027128/Sharing+and+Unsharing+an+Analysis",
        SPECIAL_CHARS:
            "https://cyverse.atlassian.net/wiki/spaces/DEmanual/pages/242027163/Troubleshooting+an+Analysis#TroubleshootinganAnalysis-3.Checktheinputfilesandparameter",
    },

    ANONYMOUS_USER: "anonymous",

    JAVA_PATTERN_DOC:
        "https://docs.oracle.com/javase/9/docs/api/java/util/regex/Pattern.html",

    URL_REGEX: /^(?:ftp|FTP|HTTPS?|https?):\/\/[^/]+\.[^/]+.*/i,

    EMAIL_REGEX:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    DE_GUIDE: "https://learning.cyverse.org/de/",
    CYVERSE_LC: "https://learning.cyverse.org/",
    DEFAULT_EMAIL: "no-reply@cyverse.org",
    GETTING_STARTED: "https://learning.cyverse.org/",
    DOI_GUIDE: "https://learning.cyverse.org/ds/doi/",

    DC_USER_AGREEMENT:
        "https://cyverse.org/policies/data-commons-user-agreement",

    CYVERSE_GLOSSARY: "https://learning.cyverse.org/glossary/",
    XSEDE_ALLOC_LINK: "https://portal.xsede.org/allocation-request-steps",
    VICE_LOADING_PAGE: "/vice",

    METADATA: {
        COMMUNITY_ATTR: "cyverse-community",
        INSTANT_LAUNCH_LOCATION_ATTR: "ui_location",
        INSTANT_LAUNCH_DASHBOARD: "dashboard",
        INSTANT_LAUNCH_NAV_DRAWER: "nav_drawer",
        INSTANT_LAUNCH_LISTING: "listing",
    },

    VICE_LOGS_POLLING_INTERVAL: 10000,
    DATA_STORAGE_QUOTA_LIMIT_DEFAULT: 50 * 2 ** 30,
    DATA_STORAGE_RESOURCE_NAME: "data.size",
    DATA_STORE_INCREASE_FORM: "https://user.cyverse.org/requests/2",
    CPU_HOURS_QUOTA_LIMIT_DEFAULT: 20,
    CPU_HOURS_RESOURCE_NAME: "cpu.hours",
};

export default constants;
