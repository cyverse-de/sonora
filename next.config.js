const config = require("config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
    publicRuntimeConfig: {
        INTERCOM_APP_ID: config.get("intercom.app_id"),
        INTERCOM_ENABLED: config.get("intercom.enabled"),
        INTERCOM_COMPANY_ID: config.get("intercom.company_id"),
        INTERCOM_COMPANY_NAME: config.get("intercom.company_name"),
        ADMIN_GROUPS: config.get("admin.groups"),
        ADMIN_GROUP_ATTRIBUTE: config.get("admin.group_attribute_name"),
        IRODS_HOME_PATH: config.get("irods.home_path"),
    },
});
