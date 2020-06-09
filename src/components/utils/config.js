import React from "react";
import getConfig from "next/config";

/**
 * A custom hook to get client side configs from nextjs config
 *
 */
function useConfig() {
    const [config, setConfig] = React.useState();
    const { publicRuntimeConfig = {} } = getConfig() || {};
    React.useEffect(() => {
        console.log(
            "setting configs -> " + publicRuntimeConfig.INTERCOM_APP_ID
        );
        const clientConfig = {
            intercom: {
                appId: publicRuntimeConfig.INTERCOM_APP_ID,
                enabled: publicRuntimeConfig.INTERCOM_ENABLED,
                companyId: publicRuntimeConfig.INTERCOM_COMPANY_ID,
                companyName: publicRuntimeConfig.INTERCOM_COMPANY_NAME,
            },
            admin: {
                groups: publicRuntimeConfig.ADMIN_GROUPS,
                group_attribute_name: publicRuntimeConfig.ADMIN_GROUP_ATTRIBUTE,
            },
        };
        setConfig(clientConfig);
    }, [
        publicRuntimeConfig.ADMIN_GROUPS,
        publicRuntimeConfig.ADMIN_GROUP_ATTRIBUTE,
        publicRuntimeConfig.INTERCOM_APP_ID,
        publicRuntimeConfig.INTERCOM_COMPANY_ID,
        publicRuntimeConfig.INTERCOM_COMPANY_NAME,
        publicRuntimeConfig.INTERCOM_ENABLED,
    ]);

    return [config];
}

export default useConfig;
