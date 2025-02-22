/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { DETableHeader } from "../../stories/base/TableHeader.stories";

it("renders table header without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<DETableHeader />);
    root.unmount();
});
