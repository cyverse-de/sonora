import React from "react";
import renderer from "react-test-renderer";

import { DataTableViewTest } from "../../stories/data/TableView.stories";

test("Data Table View renders", () => {
    const component = renderer.create(<DataTableViewTest />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
