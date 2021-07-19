import React from "react";
import ReactDOM from "react-dom";
import { DotMenuTest } from "../../stories/DotMenu.stories";

it("renders DotMenu without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DotMenuTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
