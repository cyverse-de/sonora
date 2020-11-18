import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { PathListFileViewerTest } from "../../stories/data/viewers/PathListViewer.stories";
import { PlainTextFileViewerTest } from "../../stories/data/viewers/TextViewer.stories";
import { I18nProviderWrapper } from "../i18n";
import { ConfigProvider } from "../contexts/config";

beforeAll(async () => {
    await preloadAll();
});

const TestProviderWrapper = ({ children }) => (
    <I18nProviderWrapper>
        <ConfigProvider>{children}</ConfigProvider>
    </I18nProviderWrapper>
);

test("Data Table View renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <DataTableViewTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Path List File Viewer renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <PathListFileViewerTest />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("Plain text File Viewer renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <PlainTextFileViewerTest />
        </TestProviderWrapper>
    );
    component.unmount();
});
