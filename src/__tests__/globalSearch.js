import React from "react";
import renderer from "react-test-renderer";
import { SearchField } from "../../stories/search/GlobalSearchField.stories";
import { I18nProviderWrapper } from "../i18n";
import { UserProfileProvider } from "../contexts/userProfile";

test("Search field renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <UserProfileProvider>
                <SearchField />
            </UserProfileProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});
