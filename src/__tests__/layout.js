import React, { Suspense } from "react";
import renderer from "react-test-renderer";
import { I18nextProvider } from "react-i18next";
import { AppBar } from "../../stories/CyVerseAppBar.stories";
import i18n from "../test_i18n";

test("App Bar renders", () => {
    const component = renderer.create(
        <I18nextProvider i18n={i18n}>
            <Suspense fallback="Loading...">
                <AppBar />
            </Suspense>
        </I18nextProvider>
    );
    component.unmount();
});
