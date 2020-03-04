import React from "react";

const IntercomContext = React.createContext();

/**
 * A hook that returns state for obtaining information for using intercom API.
 */
function useIntercom() {
    const context = React.useContext(IntercomContext);
    if (!context) {
        throw new Error(`useIntercom must be used within a IntercomProvider`);
    }
    return context;
}

/**
 * A React component that wraps its descendants in intercom context providers, allowing them to
 * obtain information required to use intercom API
 * @param props
 * @returns {*}
 * @constructor
 */
function IntercomProvider(props) {
    return <IntercomContext.Provider {...props} />;
}

export { IntercomProvider, useIntercom };
