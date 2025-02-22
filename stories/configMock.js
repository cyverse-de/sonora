import constants from "../src/constants";

const configMock = {
    intercom: {
        appId: "appId",
        enabled: true,
        companyId: "companyId",
        companyName: "companyName",
    },

    sessions: {
        poll_interval_ms: 5000,
    },

    admin: {
        groups: "test",
        group_attribute_name: "entitlement",
    },

    analysis: { supportUser: { user: "support_user", source_id: "ldap" } },

    irods: {
        home_path: "/iplant/home",
        trash_path: "/iplant/trash/home/de-irods",
    },

    tools: {
        default_selected_max_cpus: 4,
        admin: {
            max_cpu_limit: 48,
            max_memory_limit: 244 * constants.ONE_GiB,
            max_disk_limit: 1024 * constants.ONE_GiB,
        },
        private: {
            max_cpu_limit: 8,
            max_memory_limit: 16 * constants.ONE_GiB,
            max_disk_limit: 512 * constants.ONE_GiB,
        },
    },

    vice: {
        initContainerName: "input-files-init",
        inputFilesContainerName: "input-files",
        viceProxyContainerName: "vice-proxy",
        analysisContainerName: "analysis",
        deploymentTimeoutMs: 15000,
        defaultImage: "discoenv/cas-proxy",
        defaultName: "cas-proxy",
        defaultCasUrl: "https://olson.cyverse.org/cas",
        defaultCasValidate: "validate",
    },

    subscriptions: {
        checkout_url:
            "https://cyverse-subscription-sandbox.phoenixbioinformatics.org",
        enforce: true,
    },

    elasticEnabled: true,
};

export default configMock;
