import React from "react";
import { UserProfileProvider } from "../src/contexts/userProfile";
import { IntercomProvider } from "../src/contexts/intercom";
import CyverseAppBar from "../src/components/layout/CyVerseAppBar";
import { mockAxios } from "./axiosMock";
import { NotificationsProvider } from "../src/contexts/pushNotifications";

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
function AppBarTest() {
    mockAxios.onGet("/api/profile").reply(200, mockUser);
    return (
        <IntercomProvider value={intercomSettings}>
            <UserProfileProvider>
                <NotificationsProvider>
                    <CyverseAppBar />
                </NotificationsProvider>
            </UserProfileProvider>
        </IntercomProvider>
    );
}

export default { title: "App Bar" };

export const AppBar = () => {
    return <AppBarTest />;
};
