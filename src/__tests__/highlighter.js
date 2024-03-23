/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";

import { HighlighterTest } from "../../stories/base/Highlighter.stories";

it("renders highlighter without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<HighlighterTest />);
    root.unmount();
});
