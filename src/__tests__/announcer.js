import React from "react";
import { createRoot } from "react-dom/client";

import { AnnouncerTest } from "../../stories/base/Announcer.stories";

it("renders announcer without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(<AnnouncerTest />);
    root.unmount();
});
