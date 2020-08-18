import React from "react";
import renderer from "react-test-renderer";
import { SearchField } from "../../stories/search/GlobalSearchField.stories";
import { I18nProviderWrapper } from "../i18n";

test("Search field renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <SearchField />
        </I18nProviderWrapper>
    );
    component.unmount();
});
