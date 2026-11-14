import React from "react";
import { render } from "@testing-library/react";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";

import { ConfigProvider } from "contexts/config";
import { UserProfileProvider } from "contexts/userProfile";

import {
    AvailableAddonsListingTest,
    EmptyListingTest,
    ErroredListingTest,
} from "../../stories/subscriptions/AddonsListing.stories";

import { EditSubscriptionAddonsTest } from "../../stories/subscriptions/EditSubscriptionAddons.stories";

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

test("Available subscription add-ons listing renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <AvailableAddonsListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Available subscription add-ons listing renders without add-ons", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EmptyListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Errored available add-ons listing renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <ErroredListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Edit available add-on dialog renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EditSubscriptionAddonsTest />
        </TestProviderWrapper>
    );
    unmount();
});
