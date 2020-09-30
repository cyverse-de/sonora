const config = require("config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const ONE_GiB = 2 ** 30;

module.exports = withBundleAnalyzer({
    publicRuntimeConfig: {
        INTERCOM_APP_ID: config.get("intercom.app_id"),
        INTERCOM_ENABLED: config.get("intercom.enabled"),
        INTERCOM_COMPANY_ID: config.get("intercom.company_id"),
        INTERCOM_COMPANY_NAME: config.get("intercom.company_name"),
        ADMIN_GROUPS: config.get("admin.groups"),
        ADMIN_GROUP_ATTRIBUTE: config.get("admin.group_attribute_name"),
        IRODS_HOME_PATH: config.get("irods.home_path"),
        SESSION_POLL_INTERVAL_MS: config.has("sessions.poll_interval_ms")
            ? config.get("sessions.poll_interval_ms")
            : 5000,
        TOOLS_PRIVATE_MAX_CPU_LIMIT: config.has("tools.private.max_cpu_limit")
            ? config.get("tools.private.max_cpu_limit")
            : 8,
        TOOLS_PRIVATE_MAX_MEMORY_LIMIT: config.has(
            "tools.private.max_memory_limit"
        )
            ? config.get("tools.private.max_memory_limit")
            : 16 * ONE_GiB,
        TOOLS_PRIVATE_MAX_DISK_LIMIT: config.has("tools.private.max_disk_limit")
            ? config.get("tools.private.max_disk_limit")
            : 512 * ONE_GiB,
        HT_PATH_LIST_IDENTIFIER: config.get("fileIdentifier.htPathList"),
        MULTI_INPUT_PATH_LIST_IDENTIFIER: config.get("fileIdentifier.multiInputPathList")  
    },
});
