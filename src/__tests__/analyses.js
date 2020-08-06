import React from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";
import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";
import { I18nProviderWrapper } from "../i18n";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Analyses Listing Table without crashing", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <AnalysesTableViewTest />
        </I18nProviderWrapper>
    );
    component.unmount();
});
