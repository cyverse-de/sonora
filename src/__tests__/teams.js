import React from "react";
import renderer from "react-test-renderer";

import { Listing } from "../../stories/teams/Teams.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "../i18n";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Team listing view renders", () => {
    const component = renderer.create(
        <UserProfileProvider>
            <I18nProviderWrapper>
                <Listing />
            </I18nProviderWrapper>
        </UserProfileProvider>
    );
    component.unmount();
});
