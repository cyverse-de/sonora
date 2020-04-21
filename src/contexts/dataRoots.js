/**
 * @author aramsey
 *
 * A context specifically for setting and caching the user's data store filesystem roots (such as their
 * home directory, trash path, etc.)
 */
import React, { createContext, useContext } from "react";

const DataRootsContext = createContext();

function useDataRoots() {
    const context = useContext(DataRootsContext);
    if (!context) {
        throw new Error(`useDataRoots must be used within a DataRootsProvider`);
    }
    return context;
}

function DataRootsProvider(props) {
    const [roots, setRoots] = React.useState({});
    const value = React.useMemo(() => [roots, setRoots], [roots]);

    return (
        <DataRootsContext.Provider value={value}>
            {props.children}
        </DataRootsContext.Provider>
    );
}

export { DataRootsProvider, useDataRoots };
