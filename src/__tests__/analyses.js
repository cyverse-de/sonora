import React from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";
import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";
import { ConfigProvider } from "contexts/config";
import { I18nProviderWrapper } from "../i18n";
import { RQWrapper } from "../__mocks__/RQWrapper";
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
                    <AnalysesTableViewTest />
                </ConfigProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
