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

        return config;
    },
};
