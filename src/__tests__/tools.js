import React from "react";
import { render } from "@testing-library/react";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";

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
    const { unmount } = render(
        <TestProviderWrapper>
            <ToolListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Tool Table View renders without tools", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EmptyToolListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Errored Tool Listing renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <ErroredListingTest />
        </TestProviderWrapper>
    );
    unmount();
});
