import React from "react";
import ReactDOM from "react-dom";

import { CopyTextAreaTest } from "../../stories/base/CopyTextArea.stories";

it("renders CopyTextArea without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<CopyTextAreaTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
