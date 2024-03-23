import React from "react";
import { createRoot } from "react-dom/client";

import {
    DotMenuTest,
    DotMenuWithText,
} from "../../stories/base/DotMenu.stories";

it("renders DotMenu without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<DotMenuTest />);
    root.unmount();
});

it("renders DotMenuWithText without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<DotMenuWithText />);
    root.unmount();
});
