import React, { Component } from "react";
import { UserProfileProvider } from "../src/contexts/userProfile";
import { IntercomProvider } from "../src/contexts/intercom";
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
const intercomSettings = {
    appId: "appId",
    enabled: true,
    companyId: "companyId",
    companyName: "companyName",
};
class AppBarTest extends Component {
    render() {
        return (
            <IntercomProvider value={intercomSettings}>
                <UserProfileProvider>
                    <CyverseAppBar />
                </UserProfileProvider>
            </IntercomProvider>
        );
    }
}

export default { title: "App Bar" };

export const AppBar = () => {
    fetchMock.restore().get("/api/profile", mockUser);
    return <AppBarTest />;
};
