export default {
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
    vice: {
        initContainerName: "input-files-init",
        inputFilesContainerName: "input-files",
        viceProxyContainerName: "vice-proxy",
        analysisContainerName: "analysis",
    },
};
