import React from "react";
import renderer from "react-test-renderer";
import { AppBar } from "../../stories/CyVerseAppBar.stories";
import { I18nProviderWrapper } from "../i18n";

test("App Bar renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <AppBar />
        </I18nProviderWrapper>
    );
    component.unmount();
});
