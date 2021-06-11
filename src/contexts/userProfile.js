import React from "react";

const UserProfileContext = React.createContext();

/**
 * A hook that returns state for obtaining and updating the client-side copy
 * of the user profile information. The user profile information should only
 * be set in one React component. The information can be read from any React
 * component.
 */
function useUserProfile() {
    const context = React.useContext(UserProfileContext);
    if (!context) {
        throw new Error(
            `useUserProfile must be used within a UserProfileProvider`
        );
    }
    return context;
}

/**
 * A React component that wraps its descendants in user profile context
 * providers, allowing them to obtain information about the authenticated
 * user. This hook does not actually retrieve the user profile information
 * from the server. Exactly one of the descendant components should make a
 * call to the `/api/profile` endpoint in order to obtain the user profile
 * information and store it using the `setUserProfile` function.
 *
 * @param {object} props the React component properties.
 */
function UserProfileProvider(props) {
    const [userProfile, setUserProfile] = React.useState(null);
    const value = React.useMemo(
        () => [userProfile, setUserProfile],
        [userProfile]
    );
    return <UserProfileContext.Provider value={value} {...props} />;
}

export { UserProfileProvider, useUserProfile };
