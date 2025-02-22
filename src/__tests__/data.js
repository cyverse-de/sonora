import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { PathListFileViewerTest } from "../../stories/data/viewers/PathListViewer.stories";
import { PlainTextFileViewerTest } from "../../stories/data/viewers/TextViewer.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";
import { ConfigProvider } from "../contexts/config";
import { RQWrapper } from "../__mocks__/RQWrapper";

import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

beforeAll(async () => {
    await preloadAll();
});

const TestProviderWrapper = ({ children }) => (
    <RQWrapper>
        <I18nProviderWrapper>
            <EmotionCacheProvider>
                <ThemeProvider theme={theme}>
                    <ConfigProvider>{children}</ConfigProvider>
                </ThemeProvider>
            </EmotionCacheProvider>
        </I18nProviderWrapper>
    </RQWrapper>
);

test("Data Table View renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <DataTableViewTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("Path List File Viewer renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <PathListFileViewerTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("Plain text File Viewer renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <PlainTextFileViewerTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
