import React from "react";
import renderer from "react-test-renderer";

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
    const component = renderer.create(
        <TestProviderWrapper>
            <SubscriptionListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Subscription listing renders without subscriptions", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EmptySubscriptionListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Errored subscription listing renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <ErroredListingTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Details drawer renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <DetailsDrawerTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Edit subscription dialog renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EditSubscriptionTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Edit quotas dialog renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EditQuotasTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Edit subscription add-on dialog renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EditAddonTest />
        </TestProviderWrapper>
    );
    component.unmount();
});
