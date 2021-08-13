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
import { RQWrapper } from "../__mocks__/RQWrapper";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Tool Table View renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <ConfigProvider>
                <UserProfileProvider>
                    <ToolListingTest />
                </UserProfileProvider>
            </ConfigProvider>
        </RQWrapper>
    );
    component.unmount();
});

test("Tool Table View renders without tools", () => {
    const component = renderer.create(
        <RQWrapper>
            <ConfigProvider>
                <UserProfileProvider>
                    <EmptyToolListingTest />
                </UserProfileProvider>
            </ConfigProvider>
        </RQWrapper>
    );
    component.unmount();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <ConfigProvider>
                <UserProfileProvider>
                    <ErroredListingTest />
                </UserProfileProvider>
            </ConfigProvider>
        </RQWrapper>
    );
    component.unmount();
});
