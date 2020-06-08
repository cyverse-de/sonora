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
    component.unmount();
});

test("Errored Tool Listing renders", () => {
    const component = renderer.create(<ErroredListingTest />);
    component.unmount();
});
