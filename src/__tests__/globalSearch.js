import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import { I18nextProvider } from "react-i18next";
import { SearchField } from "../../stories/GlobalSearchField.stories";
import i18n from "../test_i18n";

test("Search field renders", () => {
    const component = renderer.create(
        <I18nextProvider i18n={i18n}>
            <Suspense fallback="Loading...">
                <SearchField />
            </Suspense>
        </I18nextProvider>
    );
    component.unmount();
});
