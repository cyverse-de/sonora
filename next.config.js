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
        ANALYSIS_SUPPORT_USER: config.get("analysis.support.user"),
        ANALYSIS_SUPPORT_SOURCE_ID: config.get("analysis.support.source_id"),
        IRODS_HOME_PATH: config.get("irods.home_path"),
        IRODS_TRASH_PATH: config.get("irods.trash_path"),
        IRODS_COMMUNITY_PATH: config.get("irods.community_path"),
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
        MULTI_INPUT_PATH_LIST_IDENTIFIER: config.get(
            "fileIdentifier.multiInputPathList"
        ),
        ANALYTICS_ENABLED: config.get("analytics.enabled"),
        ANALYTICS_ID: config.get("analytics.id"),
        VICE_DEFAULT_IMAGE: config.get("vice.defaultImage"),
        VICE_DEFAULT_NAME: config.get("vice.defaultName"),
        VICE_DEFAULT_CAS_URL: config.get("vice.defaultCasUrl"),
        VICE_DEFAULT_CAS_VALIDATE: config.get("vice.defaultCasValidate"),
        VICE_CONCURRENT_JOBS: config.has("vice.concurrentJobs")
            ? config.get("vice.concurrentJobs")
            : 2,
        VICE_USE_CASE_MIN_CHARS: config.has("vice.useCaseCharsMin")
            ? config.get("vice.useCaseCharsMin")
            : 60,
        VICE_INIT_CONTAINER_NAME: config.get("vice.initContainerName"),
        VICE_INPUT_FILES_CONTAINER_NAME: config.get(
            "vice.inputFilesContainerName"
        ),
        VICE_VICE_PROXY_CONTAINER_NAME: config.get(
            "vice.viceProxyContainerName"
        ),
        VICE_ANALYSIS_CONTAINER_NAME: config.get("vice.analysisContainerName"),
        VICE_DEPLOYMENT_TIMEOUT_MS: config.has("vice.deploymentTimeoutMs")
            ? config.get("vice.deploymentTimeoutMs")
            : 180000,
        GROUPER_ALL_USERS: config.get("grouper.allUsers"),
        GROUPER_ADMIN: config.get("grouper.admin"),
        LEGACY_DE_URL: config.get("legacy_de_url"),
    },
});
