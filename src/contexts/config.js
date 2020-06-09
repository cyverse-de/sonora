import React from "react";

const ConfigContext = React.createContext();

/**
 * A custom hook to get client side configs from nextjs config
 *
 */
function useConfig() {
    const context = React.useContext(ConfigContext);
    if (!context) {
        throw new Error(`useConfig must be used within a configProvider`);
    }
    return context;
}

function ConfigProvider(props) {
    const [config, setConfig] = React.useState(null);
    const value = React.useMemo(() => [config, setConfig], [config]);
    return <ConfigContext.Provider value={value} {...props} />;
}

export { ConfigProvider, useConfig };
