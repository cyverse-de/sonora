import React from "react";

const BootstrapInfoContext = React.createContext();

/**
 * A hook that returns state for obtaining and updating the client-side copy
 * of the user info and preferences fetched from the bootstrap endpoint.
 */
function useBootstrapInfo() {
    const context = React.useContext(BootstrapInfoContext);
    if (!context) {
        throw new Error("useBootstrap must be used within a BootstrapProvider");
    }
    return context;
}

function BootstrapInfoProvider(props) {
    const [bootstrapInfo, setBootstrapInfo] = React.useState(null);
    const value = React.useMemo(() => [bootstrapInfo, setBootstrapInfo], [
        bootstrapInfo,
    ]);

    return <BootstrapInfoContext.Provider value={value} {...props} />;
}

export { BootstrapInfoProvider, useBootstrapInfo };
