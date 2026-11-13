import config from "config";

const ONE_GiB = 2 ** 30;

// Built once at module load. A missing required key will throw here,
// crashing the pod at startup rather than serving 500s to every user.
const publicConfig = {
    intercom: {
        appId: config.get("intercom.app_id"),
        enabled: config.get("intercom.enabled"),
        companyId: config.get("intercom.company_id"),
        companyName: config.get("intercom.company_name"),
        userProfileUrl: config.get("intercom.user_profile_url"),
    },
    admin: {
        groups: config.get("admin.groups"),
        group_attribute_name: config.get("admin.group_attribute_name"),
    },
    analysis: {
        supportUser: {
            id: config.get("analysis.support.user"),
            source_id: config.get("analysis.support.source_id"),
        },
    },
    irods: {
        home_path: config.get("irods.home_path"),
        trash_path: config.get("irods.trash_path"),
        community_path: config.get("irods.community_path"),
    },
    sessions: {
        poll_interval_ms: config.has("sessions.poll_interval_ms")
            ? config.get("sessions.poll_interval_ms")
            : 5000,
    },
    tools: {
        default_selected_max_cpus: config.has("tools.default_selected_max_cpus")
            ? config.get("tools.default_selected_max_cpus")
            : 4,
        admin: {
            max_cpu_limit: config.has("tools.admin.max_cpu_limit")
                ? config.get("tools.admin.max_cpu_limit")
                : 8,
            max_memory_limit: config.has("tools.admin.max_memory_limit")
                ? config.get("tools.admin.max_memory_limit")
                : 16 * ONE_GiB,
            max_disk_limit: config.has("tools.admin.max_disk_limit")
                ? config.get("tools.admin.max_disk_limit")
                : 512 * ONE_GiB,
            max_gpu_limit: config.has("tools.admin.max_gpu_limit")
                ? config.get("tools.admin.max_gpu_limit")
                : 0,
        },
        private: {
            max_cpu_limit: config.has("tools.private.max_cpu_limit")
                ? config.get("tools.private.max_cpu_limit")
                : 8,
            max_memory_limit: config.has("tools.private.max_memory_limit")
                ? config.get("tools.private.max_memory_limit")
                : 16 * ONE_GiB,
            max_disk_limit: config.has("tools.private.max_disk_limit")
                ? config.get("tools.private.max_disk_limit")
                : 512 * ONE_GiB,
            max_gpu_limit: config.has("tools.private.max_gpu_limit")
                ? config.get("tools.private.max_gpu_limit")
                : 0,
        },
    },
    fileIdentifiers: {
        htPathList: config.get("fileIdentifier.htPathList"),
        multiInputPathList: config.get("fileIdentifier.multiInputPathList"),
    },
    analytics: {
        enabled: config.get("analytics.enabled"),
        id: config.get("analytics.id"),
    },
    vice: {
        defaultImage: config.get("vice.defaultImage"),
        defaultName: config.get("vice.defaultName"),
        defaultCasUrl: config.get("vice.defaultCasUrl"),
        defaultCasValidate: config.get("vice.defaultCasValidate"),
        concurrentJobs: config.has("vice.concurrentJobs")
            ? config.get("vice.concurrentJobs")
            : 2,
        useCaseMinChars: config.has("vice.useCaseCharsMin")
            ? config.get("vice.useCaseCharsMin")
            : 60,
        initContainerName: config.get("vice.initContainerName"),
        inputFilesContainerName: config.get("vice.inputFilesContainerName"),
        viceProxyContainerName: config.get("vice.viceProxyContainerName"),
        analysisContainerName: config.get("vice.analysisContainerName"),
        deploymentTimeoutMs: config.has("vice.deploymentTimeoutMs")
            ? config.get("vice.deploymentTimeoutMs")
            : 180000,
    },
    grouper: {
        allUsers: config.get("grouper.allUsers"),
        admin: config.get("grouper.admin"),
    },
    subscriptions: {
        checkout_url: config.get("subscriptions.checkout_url"),
        enforce: config.get("subscriptions.enforce"),
    },
    usernameSuffix: config.get("username.suffix"),
    userPortalURL: config.get("user_portal_url"),
    supportEmail: config.get("support_email"),
    deFaq: config.get("de_faq"),
    cyverseURL: config.get("cyverse_url"),
    elasticEnabled: config.get("elastic.enabled"),
    queriesConcurrencyLimit: config.get("queriesConcurrencyLimit"),
};

export default publicConfig;
