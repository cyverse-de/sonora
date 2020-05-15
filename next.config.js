const config = require("config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
    env: {
        INTERCOM_APP_ID: config.get("intercom.app_id"),
        INTERCOM_ENABLED: config.get("intercom.enabled"),
        INTERCOM_COMPANY_ID: config.get("intercom.company_id"),
        INTERCOM_COMPANY_NAME: config.get("intercom.company_name"),
    },
});
