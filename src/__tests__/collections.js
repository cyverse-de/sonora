import React from "react";
import renderer from "react-test-renderer";

import { View } from "../../stories/collections/Collections.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "i18n";
import { RQWrapper } from "../__mocks__/RQWrapper";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Collection view renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <UserProfileProvider>
                <I18nProviderWrapper>
                    <View />
                </I18nProviderWrapper>
            </UserProfileProvider>
        </RQWrapper>
    );
    component.unmount();
});
