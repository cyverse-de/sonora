import React from "react";
import renderer from "react-test-renderer";
import { ThemeProvider } from "@material-ui/styles";
import { DataTableViewTest } from "../../stories/data/TableView.stories";
import { getMuiTheme } from "@cyverse-de/ui-lib";

test("Data Table View renders", () => {
    const component = renderer.create(
        <ThemeProvider theme={getMuiTheme()}>
            <DataTableViewTest />
        </ThemeProvider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
