import React from "react";
import renderer from "react-test-renderer";

import {
    EmptyToolListingTest,
    ErroredListingTest,
    ToolListingTest,
} from "../../stories/tools/Listing.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Tool Table View renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <ToolListingTest />
        </UserProfileProvider>
    );
    component.unmount();
});

test("Tool Table View renders without tools", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <EmptyToolListingTest />
        </UserProfileProvider>
    );
    component.unmount();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <ErroredListingTest />
        </UserProfileProvider>
    );
    component.unmount();
});
