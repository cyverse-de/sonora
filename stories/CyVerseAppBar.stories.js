import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import CyverseAppBar from "../src/components/appBar/CyVerseAppBar";
import { UserProfileProvider } from "../src/contexts/userProfile";
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

export class AppBarTest extends Component {
    render() {
        return (
            <UserProfileProvider>
                <CyverseAppBar />
            </UserProfileProvider>
        );
    }
}

storiesOf("AppBar", module).add("with appbar", () => {
    fetchMock.restore().get("/api/profile", mockUser);
    return <AppBarTest />;
});
