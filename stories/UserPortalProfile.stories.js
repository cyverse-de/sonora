import React from "react";
import { mockAxios } from "./axiosMock";
import { portalUserStatus, STATUS } from "./UserPortalMocks";
import DEAppBar from "../src/components/layout/AppBar";
import { UserProfileProvider } from "../src/contexts/userProfile";
import testConfig from "./configMock";

export default { title: "User Portal Status" };

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
            <DEAppBar setAppBarRef={() => {}} clientConfig={testConfig} />
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
            <DEAppBar setAppBarRef={() => {}} clientConfig={testConfig} />
        </UserProfileProvider>
    );
}
