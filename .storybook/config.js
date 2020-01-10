import { withConsole } from "@storybook/addon-console";
import { addDecorator, configure } from "@storybook/react";

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

configure(require.context("../stories", true, /\.stories\.js$/), module);
