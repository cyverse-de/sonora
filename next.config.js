import {
    intercomAppId,
    intercomCompanyId,
    intercomCompanyName,
    intercomEnabled,
} from "./src/server/configuration";

module.exports = (phase) => {
    return {
        serverRuntimeConfig: {
            INTERCOM_APP_ID: intercomAppId,
            INTERCOM_ENABLED: intercomEnabled,
            INTERCOM_COMPANY_ID: intercomCompanyId,
            INTERCOM_COMPANY_NAME: intercomCompanyName,
        },
    };
};
