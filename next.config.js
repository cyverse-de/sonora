const config = require("config");
const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const ONE_GiB = 2 ** 30;

module.exports = withBundleAnalyzer({
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/dashboard",
            },
        ];
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        return config;
    },
    i18n,
    publicRuntimeConfig: {
        INTERCOM_APP_ID: config.get("intercom.app_id"),
        INTERCOM_ENABLED: config.get("intercom.enabled"),
        INTERCOM_COMPANY_ID: config.get("intercom.company_id"),
        INTERCOM_COMPANY_NAME: config.get("intercom.company_name"),
        INTERCOM_USER_PROFILE_URL: config.get("intercom.user_profile_url"),
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
        TOOLS_DEFAULT_SELECTED_MAX_CPUS: config.has(
            "tools.default_selected_max_cpus"
        )
            ? config.get("tools.default_selected_max_cpus")
            : 4,
        TOOLS_ADMIN_MAX_CPU_LIMIT: config.has("tools.admin.max_cpu_limit")
            ? config.get("tools.admin.max_cpu_limit")
            : 8,
        TOOLS_ADMIN_MAX_MEMORY_LIMIT: config.has("tools.admin.max_memory_limit")
            ? config.get("tools.admin.max_memory_limit")
            : 16 * ONE_GiB,
        TOOLS_ADMIN_MAX_DISK_LIMIT: config.has("tools.admin.max_disk_limit")
            ? config.get("tools.admin.max_disk_limit")
            : 512 * ONE_GiB,
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
        SUBSCRIPTIONS_CHECKOUT_URL: config.get("subscriptions.checkout_url"),
        SUBSCRIPTIONS_ENFORCE: config.get("subscriptions.enforce"),
        USERNAME_SUFFIX: config.get("username.suffix"),
        USER_PORTAL_URL: config.get("user_portal_url"),
        SUPPORT_EMAIL: config.get("support_email"),
        DE_FAQ: config.get("de_faq"),
        CYVERSE_URL: config.get("cyverse_url"),
        ELASTIC_ENABLED: config.get("elastic.enabled"),
    },
});
