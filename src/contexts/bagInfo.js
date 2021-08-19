/**
 *  @author sriram
 *
 * A context to provide bag information.
 *
 */
import React from "react";

const BagInfoContext = React.createContext();

function useBagInfo() {
    const context = React.useContext(BagInfoContext);
    if (!context) {
        throw new Error("useBagInfo must be used within a BagInfoProvider");
    }
    return context;
}

function BagInfoProvider(props) {
    const [bagInfo, setBagInfo] = React.useState(null);
    const value = React.useMemo(() => [bagInfo, setBagInfo], [bagInfo]);

    return <BagInfoContext.Provider value={value} {...props} />;
}

export { BagInfoProvider, useBagInfo };
