import React from "react";

const UserProfileContext = React.createContext();

function useUserProfile() {
    const context = React.useContext(UserProfileContext);
    if (!context) {
        throw new Error(
            `useUserProfile must be used within a UserProfileProvider`
        );
    }
    return context;
}

function UserProfileProvider(props) {
    const [userProfile, setUserProfile] = React.useState(null);
    const value = React.useMemo(() => [userProfile, setUserProfile], [
        userProfile,
    ]);
    return <UserProfileContext.Provider value={value} {...props} />;
}

export { UserProfileProvider, useUserProfile };
