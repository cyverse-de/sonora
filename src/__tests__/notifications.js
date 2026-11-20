import React from "react";

import { render } from "@testing-library/react";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";

import { mockAxios } from "../../stories/axiosMock";

import { Listing } from "../../stories/notifications/Listing.stories";
import { NotificationsPreviewTest } from "../../stories/notifications/Notifications.stories";
import { UserProfileProvider } from "../contexts/userProfile";
import { RQWrapper } from "../__mocks__/RQWrapper";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Notifications Listing without crashing", () => {
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <UserProfileProvider>
                    <Listing />
                </UserProfileProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});

test("renders Notifications Menu without crashing", () => {
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <UserProfileProvider>
                    <NotificationsPreviewTest />
                </UserProfileProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});
