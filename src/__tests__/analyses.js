import { mockAxios } from "../../stories/axiosMock";
import renderer from "react-test-renderer";
import React from "react";
import { AnalysesListingTest } from "../../stories/analyses/Listing.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Analyses Listing view", () => {
    const component = renderer.create(<AnalysesListingTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
