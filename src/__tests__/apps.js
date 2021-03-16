import React from "react";
import TestRenderer from "react-test-renderer";

import { AppTiles } from "../../stories/apps/AppTile.stories";
import { AppsTableViewTest } from "../../stories/apps/TableView.stories";
import { mockAxios } from "../../stories/axiosMock";
import { AppsListingTest } from "../../stories/apps/Listing.stories";
import { I18nProviderWrapper } from "../i18n";
import { UserProfileProvider } from "contexts/userProfile";
import { ConfigProvider } from "contexts/config";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("App Tile renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <UserProfileProvider>
                <ConfigProvider>
                    <AppTiles />
                </ConfigProvider>
            </UserProfileProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("App Table view renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <UserProfileProvider>
                <ConfigProvider>
                    <AppsTableViewTest />
                </ConfigProvider>
            </UserProfileProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("App Listing view", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <AppsListingTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});
