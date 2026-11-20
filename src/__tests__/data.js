import React from "react";
import { render } from "@testing-library/react";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { PathListFileViewerTest } from "../../stories/data/viewers/PathListViewer.stories";
import { PlainTextFileViewerTest } from "../../stories/data/viewers/TextViewer.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { EmotionCacheProvider } from "__mocks__/EmotionCacheProvider";
import { ConfigProvider } from "../contexts/config";
import { RQWrapper } from "../__mocks__/RQWrapper";

import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

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
    const { unmount } = render(
        <RQWrapper>
            <TestProviderWrapper>
                <DataTableViewTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    unmount();
});

test("Path List File Viewer renders", () => {
    const { unmount } = render(
        <RQWrapper>
            <TestProviderWrapper>
                <PathListFileViewerTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    unmount();
});

test("Plain text File Viewer renders", () => {
    const { unmount } = render(
        <RQWrapper>
            <TestProviderWrapper>
                <PlainTextFileViewerTest />
            </TestProviderWrapper>
        </RQWrapper>
    );
    unmount();
});
