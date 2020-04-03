import React from "react";
import renderer from "react-test-renderer";

import { AppTiles } from "../../stories/apps/AppTile.stories";
import { AppsTableViewTest } from "../../stories/apps/TableView.stories";

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
