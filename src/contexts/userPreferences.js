import React from "react";

const PreferencesContext = React.createContext();

/**
 * A hook that returns state for obtaining and updating the client-side copy
 * of the user preferences.
 */
function usePreferences() {
    const context = React.useContext(PreferencesContext);
    if (!context) {
        throw new Error(
            `usePreferences must be used within a PreferencesProvider`
        );
    }
    return context;
}

function PreferencesProvider(props) {
    const [preferences, setPreferences] = React.useState(null);
    const value = React.useMemo(() => [preferences, setPreferences], [
        preferences,
    ]);
    return <PreferencesContext.Provider value={value} {...props} />;
}

export { PreferencesProvider, usePreferences };
