import React from "react";
import renderer from "react-test-renderer";
import { AppBar } from "../../stories/CyVerseAppBar.stories";
import { I18nProviderWrapper } from "../i18n";
import { PreferencesProvider } from "contexts/userPreferences";

test("App Bar renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <PreferencesProvider>
                <AppBar />
            </PreferencesProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});
