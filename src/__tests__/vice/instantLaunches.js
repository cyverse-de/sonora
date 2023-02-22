import React from "react";

import TestRenderer from "react-test-renderer";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { mockAxios } from "../../../stories/axiosMock";
import { RQWrapper } from "../../__mocks__/RQWrapper";
import { NormalListing } from "../../../stories/instantlaunches/InstantLaunchListing.stories";
import { ConfigProvider } from "contexts/config";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Instant Launch Listing without crashing", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <ConfigProvider>
                    <NormalListing />
                </ConfigProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
