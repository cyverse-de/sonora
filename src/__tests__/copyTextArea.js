/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";

import { CopyTextAreaTest } from "../../stories/base/CopyTextArea.stories";

it("renders CopyTextArea without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<CopyTextAreaTest />);
    root.unmount();
});
