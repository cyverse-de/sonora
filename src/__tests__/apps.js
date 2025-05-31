import React from "react";
import TestRenderer from "react-test-renderer";

import { AppsTableViewTest } from "../../stories/apps/TableView.stories";
import { mockAxios } from "../../stories/axiosMock";
import { NormalListing } from "../../stories/apps/Listing.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { UserProfileProvider } from "contexts/userProfile";
import { ConfigProvider } from "contexts/config";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { BagInfoProvider } from "../contexts/bagInfo";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("App Table view renders", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <UserProfileProvider>
                    <ConfigProvider>
                        <AppsTableViewTest />
                    </ConfigProvider>
                </UserProfileProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("App Listing view", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <BagInfoProvider>
                    <NormalListing />
                </BagInfoProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
