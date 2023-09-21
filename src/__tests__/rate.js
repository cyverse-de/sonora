import React from "react";
import ReactDOM from "react-dom";
import { RatingTest } from "../../stories/base/Rate.stories";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

it("renders rate without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <ThemeProvider theme={theme}>
            <RatingTest />
        </ThemeProvider>,
        div
    );
    ReactDOM.unmountComponentAtNode(div);
});
