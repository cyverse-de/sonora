import React from "react";

import { mockAxios } from "../../stories/axiosMock";
import TestRenderer from "react-test-renderer";

import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("renders Analyses Listing Table without crashing", () => {
    const component = TestRenderer.create(<AnalysesTableViewTest />);
    component.unmount();
});
