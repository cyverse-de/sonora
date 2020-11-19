import React from "react";
import UserMenu from "../src/components/layout/UserMenu";
const mockUser = {
    id: "mockUser",
    attributes: {
        credentialType: "UsernamePasswordCredential",
        email: "mockuser@example.org",
        entitlement: ["foo", "bar", "baz"],
        firstName: "Mock",
        lastName: "User",
        name: "Mock User",
    },
};

function UserMenuTest() {
    return <UserMenu profile={mockUser} />;
}

export default { title: "App Bar / User Menu" };

export const AppBar = () => {
    return <UserMenuTest />;
};
