import React from "react";
import renderer from "react-test-renderer";

import { ConfigProvider } from "contexts/config";
import { UserProfileProvider } from "contexts/userProfile";

import {
    EmptyToolListingTest,
    ErroredListingTest,
    ToolListingTest,
} from "../../stories/tools/Listing.stories";
import { mockAxios } from "../../stories/axiosMock";


beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Tool Table View renders", () => {
    const component = renderer.create(
        <ConfigProvider>
            <UserProfileProvider>
                <ToolListingTest />
            </UserProfileProvider>
        </ConfigProvider>
    );
    component.unmount();
});

test("Tool Table View renders without tools", () => {
    const component = renderer.create(
        <ConfigProvider>
            <UserProfileProvider>
                <EmptyToolListingTest />
            </UserProfileProvider>
        </ConfigProvider>
    );
    component.unmount();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(
        <ConfigProvider>
            <UserProfileProvider>
                <ErroredListingTest />
            </UserProfileProvider>
        </ConfigProvider>
    );
    component.unmount();
});
