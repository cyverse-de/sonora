import React from "react";
import renderer from "react-test-renderer";

import { View } from "../../stories/teams/Teams.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "../i18n";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Team view renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <I18nProviderWrapper>
                <View />
            </I18nProviderWrapper>
        </UserProfileProvider>
    );
    component.unmount();
});
