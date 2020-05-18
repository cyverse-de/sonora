import React from "react";
import renderer from "react-test-renderer";
import { AppBar } from "../../stories/CyVerseAppBar.stories";

test("App Bar renders", () => {
    const component = renderer.create(<AppBar />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
