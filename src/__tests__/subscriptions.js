import React from "react";
import { render } from "@testing-library/react";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";

import { ConfigProvider } from "contexts/config";
import { UserProfileProvider } from "contexts/userProfile";

import {
    SubscriptionListingTest,
    EmptySubscriptionListingTest,
    ErroredListingTest,
} from "../../stories/subscriptions/Listing.stories";
import { DetailsDrawerTest } from "../../stories/subscriptions/SubscriptionDetails.stories";
import { EditSubscriptionTest } from "../../stories/subscriptions/EditSubscription.stories";
import { EditQuotasTest } from "../../stories/subscriptions/EditQuotas.stories";
import { EditAddonTest } from "../../stories/subscriptions/EditAddon.stories";

import { mockAxios } from "../../stories/axiosMock";
import { RQWrapper } from "../__mocks__/RQWrapper";

import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

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
                <EmotionCacheProvider>
                    <ThemeProvider theme={theme}>
                        <UserProfileProvider>{children}</UserProfileProvider>
                    </ThemeProvider>
                </EmotionCacheProvider>
            </ConfigProvider>
        </I18nProviderWrapper>
    </RQWrapper>
);

test("Subscription listing renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <SubscriptionListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Subscription listing renders without subscriptions", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EmptySubscriptionListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Errored subscription listing renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <ErroredListingTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Details drawer renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <DetailsDrawerTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Edit subscription dialog renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EditSubscriptionTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Edit quotas dialog renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EditQuotasTest />
        </TestProviderWrapper>
    );
    unmount();
});

test("Edit subscription add-on dialog renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EditAddonTest />
        </TestProviderWrapper>
    );
    unmount();
});
