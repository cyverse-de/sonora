import React from "react";
import ReactDOM from "react-dom";

import { AutocompleteTest } from "../../stories/Autocomplete.stories";

it("renders autocomplete without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<AutocompleteTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
