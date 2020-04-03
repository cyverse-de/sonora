import React from "react";
import { withConsole } from "@storybook/addon-console";
import { addDecorator, configure } from "@storybook/react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/components/theme/default";
import { UserProfileProvider } from "../src/contexts/userProfile";

addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
        <UserProfileProvider>
                {storyFn()}
        </UserProfileProvider>
    </ThemeProvider>
));

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

configure(require.context("../stories", true, /\.stories\.js$/), module);
