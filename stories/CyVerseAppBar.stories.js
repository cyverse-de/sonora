import React from "react";
import { UserProfileProvider } from "../src/contexts/userProfile";
import { ConfigProvider } from "../src/contexts/config";
import CyverseAppBar from "../src/components/layout/CyVerseAppBar";
import { mockAxios } from "./axiosMock";
import { NotificationsProvider } from "../src/contexts/pushNotifications";
import testConfig from "./configMock";

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
function AppBarTest() {
    mockAxios.onGet("/api/profile").reply(200, mockUser);
    return (
        <UserProfileProvider>
            <NotificationsProvider>
                <ConfigProvider>
                    <CyverseAppBar
                        setAppBarRef={() => {}}
                        clientConfig={testConfig}
                    />
                </ConfigProvider>
            </NotificationsProvider>
        </UserProfileProvider>
    );
}

export default { title: "App Bar" };

export const AppBar = () => {
    return <AppBarTest />;
};
