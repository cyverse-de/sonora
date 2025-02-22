import React from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";
import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";
import { ConfigProvider } from "contexts/config";
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

test("renders Analyses Listing Table without crashing", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <ConfigProvider>
                    <EmotionCacheProvider>
                        <ThemeProvider theme={theme}>
                            <AnalysesTableViewTest />
                        </ThemeProvider>
                    </EmotionCacheProvider>
                </ConfigProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
