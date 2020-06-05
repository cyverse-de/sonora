import React from "react";
import renderer from "react-test-renderer";

import {
    EmptyToolListingTest,
    ErroredListingTest,
    ToolListingTest,
} from "../../stories/tools/Listing.stories";
import { mockAxios } from "../../stories/axiosMock";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("Tool Table View renders", () => {
    const component = renderer.create(<ToolListingTest />);
    component.unmount();
});

test("Tool Table View renders without tools", () => {
    const component = renderer.create(<EmptyToolListingTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(<ErroredListingTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
