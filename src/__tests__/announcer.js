import React from "react";
import ReactDOM from "react-dom";

import { AnnouncerTest } from "../../stories/base/Announcer.stories";

it("renders announcer without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<AnnouncerTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
