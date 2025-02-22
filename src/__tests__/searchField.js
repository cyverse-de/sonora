/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { SearchFieldTest } from "../../stories/base/SearchField.stories";

it("renders search field without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<SearchFieldTest />);
    root.unmount();
});
