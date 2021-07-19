import React from "react";
import ReactDOM from "react-dom";
import { SearchFieldTest } from "../../stories/SearchField.stories";

it("renders search field without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SearchFieldTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
