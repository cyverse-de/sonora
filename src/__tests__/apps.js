import React from "react";
import TestRenderer from "react-test-renderer";

import { AppTiles } from "../../stories/apps/AppTile.stories";
import { AppsTableViewTest } from "../../stories/apps/TableView.stories";
import { mockAxios } from "../../stories/axiosMock";
import { AppsListingTest } from "../../stories/apps/Listing.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("App Tile renders", () => {
    const component = TestRenderer.create(<AppTiles />);
    component.unmount();
});

test("App Table view renders", () => {
    const component = TestRenderer.create(<AppsTableViewTest />);
    component.unmount();
});

test("App Listing view", () => {
    const component = TestRenderer.create(<AppsListingTest />);
    component.unmount();
});
