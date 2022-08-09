import React from "react";
import ReactDOM from "react-dom";
import {
    DotMenuTest,
    DotMenuWithText,
} from "../../stories/base/DotMenu.stories";

it("renders DotMenu without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DotMenuTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("renders DotMenuWithText without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DotMenuWithText />, div);
    ReactDOM.unmountComponentAtNode(div);
});
