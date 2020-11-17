import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";
import { AppBarTest } from "../../stories/CyVerseAppBar.stories";
import { I18nProviderWrapper } from "../i18n";
import { PreferencesProvider } from "contexts/userPreferences";

beforeAll(async () => {
    await preloadAll();
});

test("App Bar renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <PreferencesProvider>
                <AppBarTest />
            </PreferencesProvider>
        </I18nProviderWrapper>
    );
    component.unmount();
});
