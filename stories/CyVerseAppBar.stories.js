import React, { Component } from "react";
import { UserProfileProvider } from "../src/contexts/userProfile";
import CyverseAppBar from "../src/components/layout/CyVerseAppBar";
import fetchMock from "fetch-mock";

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

class AppBarTest extends Component {
    render() {
        return (
            <UserProfileProvider>
                <CyverseAppBar />
            </UserProfileProvider>
        );
    }
}

export default { title: "App Bar" };

export const AppBar = () => {
    fetchMock.restore().get("/api/profile", mockUser);
    return <AppBarTest />;
};
