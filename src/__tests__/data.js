import React from "react";
import renderer from "react-test-renderer";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { PathListFileViewerTest } from "../../stories/data/viewers/PathListViewer.stories";
import { PlainTextFileViewerTest } from "../../stories/data/viewers/TextViewer.stories";
import { I18nProviderWrapper } from "../i18n";

test("Data Table View renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <DataTableViewTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("Path List File Viewer renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <PathListFileViewerTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("Plain text File Viewer renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <PlainTextFileViewerTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});
