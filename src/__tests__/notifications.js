import React from "react";

import TestRenderer from "react-test-renderer";

import { I18nProviderWrapper } from "../i18n";

import { mockAxios } from "../../stories/axiosMock";

import { Listing } from "../../stories/notifications/Listing.stories";
import { NotificationsPreviewTest } from "../../stories/notifications/Notifications.stories";
import { UserProfileProvider } from "../contexts/userProfile";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Notifications Listing without crashing", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <UserProfileProvider>
                <Listing />
            </UserProfileProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("renders Notifications Menu without crashing", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <UserProfileProvider>
                <NotificationsPreviewTest />
            </UserProfileProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});
