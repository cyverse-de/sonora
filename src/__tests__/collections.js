import React from "react";
import renderer from "react-test-renderer";

import { View } from "../../stories/collections/Collections.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { RQWrapper } from "../__mocks__/RQWrapper";

import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Collection view renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <UserProfileProvider>
                <I18nProviderWrapper>
                    <ThemeProvider theme={theme}>
                        <View />
                    </ThemeProvider>
                </I18nProviderWrapper>
            </UserProfileProvider>
        </RQWrapper>
    );
    component.unmount();
});
