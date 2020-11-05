// .storybook/main.js
const path = require("path");
module.exports = {
    stories: ["../stories/**/*.stories.@(js|mdx)"],
    addons: ["@storybook/addon-essentials"],
    webpackFinal: async (config, { configType }) => {
        config.resolve.modules = [
            path.resolve(__dirname, "..", "src"),
            "node_modules",
        ];

        return config;
    },
};
