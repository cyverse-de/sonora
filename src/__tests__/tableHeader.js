import React from "react";
import ReactDOM from "react-dom";
import { DETableHeader } from "../../stories/base/TableHeader.stories";

it("renders table header without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DETableHeader />, div);
    ReactDOM.unmountComponentAtNode(div);
});
