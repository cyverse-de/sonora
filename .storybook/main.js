// .storybook/main.js
const path = require("path");
module.exports = {
    stories: ["../stories/**/*.@(mdx|stories.@(js))"],
    staticDirs: ["../public"],
    addons: ["@chromatic-com/storybook"],

    framework: {
        name: "@storybook/nextjs",
    },

    webpackFinal: async (config) => {
        config.resolve.modules = [
            path.resolve(__dirname, "..", "src"),
            "node_modules",
        ];

        // node-config uses fs.readFileSync, unavailable in the browser.
        // _document.js imports server/publicConfig which imports "config";
        // redirect to a browser-safe stub so Storybook can bundle it.
        config.resolve.alias.config = path.resolve(__dirname, "configMock.js");

        return config;
    },
};
