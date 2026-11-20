import React from "react";

import { render } from "@testing-library/react";

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
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <ConfigProvider>
                    <NormalListing />
                </ConfigProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});
