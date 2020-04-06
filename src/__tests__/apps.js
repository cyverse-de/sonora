import React from "react";
import renderer from "react-test-renderer";

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
    const component = renderer.create(<AppTiles />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("App Table view renders", () => {
    const component = renderer.create(<AppsTableViewTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("App Listing view", () => {
    const component = renderer.create(<AppsListingTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
