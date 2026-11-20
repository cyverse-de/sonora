import React from "react";
import { render } from "@testing-library/react";

import { View } from "../../stories/collections/Collections.stories";
import { mockAxios } from "../../stories/axiosMock";
import { UserProfileProvider } from "contexts/userProfile";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";
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
    const { unmount } = render(
        <RQWrapper>
            <UserProfileProvider>
                <I18nProviderWrapper>
                    <EmotionCacheProvider>
                        <ThemeProvider theme={theme}>
                            <View />
                        </ThemeProvider>
                    </EmotionCacheProvider>
                </I18nProviderWrapper>
            </UserProfileProvider>
        </RQWrapper>
    );
    unmount();
});
