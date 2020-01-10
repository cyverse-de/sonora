import React from "react";
import renderer from "react-test-renderer";

import { AppTiles } from "../stories/AppTile.stories";

test("App Tile renders", () => {
    const component = renderer.create(<AppTiles />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
