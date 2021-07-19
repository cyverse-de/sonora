import React from "react";
import ReactDOM from "react-dom";
import { TriggerFieldTest } from "../../stories/TriggerField.stories";

it("renders trigger field without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<TriggerFieldTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
