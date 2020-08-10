import React from "react";
import renderer from "react-test-renderer";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { I18nProviderWrapper } from "../i18n";

test("Data Table View renders", () => {
    const component = renderer.create(
        <I18nProviderWrapper>
            <DataTableViewTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});
