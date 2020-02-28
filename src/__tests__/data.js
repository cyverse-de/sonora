import React from "react";
import renderer from "react-test-renderer";

import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { DataNavigationTest } from "../../stories/data/DataNavigation.stories";

test("Data Table View renders", () => {
    const component = renderer.create(<DataTableViewTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("Data Navigation View renders", () => {
    const component = renderer.create(<DataNavigationTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
