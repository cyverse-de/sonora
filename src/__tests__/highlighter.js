import React from "react";
import ReactDOM from "react-dom";

import { HighlighterTest } from "../../stories/Highlighter.stories";

it("renders highlighter without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<HighlighterTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
