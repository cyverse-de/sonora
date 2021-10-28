import React from "react";

import TestRenderer from "react-test-renderer";

import { I18nProviderWrapper } from "i18n";
import { mockAxios } from "../../../stories/axiosMock";
import { RQWrapper } from "../../__mocks__/RQWrapper";
import { InstantLaunchListTest } from "../../../stories/instantlaunches/InstantLaunchListing.stories";

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
                <InstantLaunchListTest />
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
