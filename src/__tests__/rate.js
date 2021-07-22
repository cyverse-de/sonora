import React from "react";
import ReactDOM from "react-dom";
import { RatingTest } from "../../stories/base/Rate.stories";

it("renders rate without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<RatingTest />, div);
    ReactDOM.unmountComponentAtNode(div);
});
