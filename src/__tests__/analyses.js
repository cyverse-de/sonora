import React, { Suspense } from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";
import { I18nextProvider } from "react-i18next";

import i18n from "../test_i18n";
import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Analyses Listing Table without crashing", () => {
    const component = TestRenderer.create(
        <I18nextProvider i18n={i18n}>
            <Suspense fallback="Loading...">
                <AnalysesTableViewTest />
            </Suspense>
        </I18nextProvider>
    );
    component.unmount();
});
