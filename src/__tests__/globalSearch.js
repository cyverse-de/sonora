import React from "react";
import renderer from "react-test-renderer";
import { SearchField } from "../../stories/search/GlobalSearchField.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { UserProfileProvider } from "../contexts/userProfile";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { ConfigProvider } from "contexts/config";

test("Search field renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <UserProfileProvider>
                    <ConfigProvider>
                        <SearchField />
                    </ConfigProvider>
                </UserProfileProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
