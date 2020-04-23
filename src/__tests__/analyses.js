import { mockAxios } from "../../stories/axiosMock";
import renderer from "react-test-renderer";
import React from "react";
import { AnalysesTableViewTest } from "../../stories/analyses/TableView.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Analyses Listing view", () => {
    const component = renderer.create(<AnalysesTableViewTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
