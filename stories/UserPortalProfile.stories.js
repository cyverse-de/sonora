import React from "react";
import { AXIOS_DELAY, mockAxios } from "./axiosMock";
import { portalUserStatus, STATUS } from "./UserPortalMocks";
import DEAppBar from "components/layout/AppBar";
import { NotificationsProvider } from "contexts/pushNotifications";
import { UserProfileProvider } from "contexts/userProfile";
import testConfig from "./configMock";

export default {
    title: "User Portal Status",
    parameters: {
        chromatic: { delay: AXIOS_DELAY * 2 },
    },
};

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

export function GracePeriod() {
    mockAxios.onGet("/api/profile").reply(200, mockUser);
    mockAxios
        .onGet(`api/users/${mockUser.id}/status`)
        .reply(200, () => portalUserStatus(STATUS.GRACE));
    return (
        <UserProfileProvider>
            <NotificationsProvider wsEnabled={false}>
                <DEAppBar setAppBarRef={() => {}} clientConfig={testConfig} />
            </NotificationsProvider>
        </UserProfileProvider>
    );
}

export function Expired() {
    mockAxios.onGet("/api/profile").reply(200, mockUser);
    mockAxios
        .onGet(`api/users/${mockUser.id}/status`)
        .reply(200, () => portalUserStatus(STATUS.EXPIRED));
    return (
        <UserProfileProvider>
            <NotificationsProvider wsEnabled={false}>
                <DEAppBar setAppBarRef={() => {}} clientConfig={testConfig} />
            </NotificationsProvider>
        </UserProfileProvider>
    );
}
