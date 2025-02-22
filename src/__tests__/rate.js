/**
 * @jest-environment jsdom
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { RatingTest } from "../../stories/base/Rate.stories";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

it("renders rate without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
        <ThemeProvider theme={theme}>
            <RatingTest />
        </ThemeProvider>
    );
    root.unmount();
});
