import React from "react";
import renderer from "react-test-renderer";

import { I18nProviderWrapper } from "../i18n";

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

const TestProviderWrapper = ({ children }) => (
    <RQWrapper>
        <I18nProviderWrapper>
            <ConfigProvider>
                <UserProfileProvider>{children}</UserProfileProvider>
            </ConfigProvider>
        </I18nProviderWrapper>
    </RQWrapper>
);

test("Tool Table View renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <ToolListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Tool Table View renders without tools", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EmptyToolListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <ErroredListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});
