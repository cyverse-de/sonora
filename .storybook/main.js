// .storybook/main.js
const path = require("path");
module.exports = {
    stories: ["../stories/**/*.@(mdx|stories.@(js))"],
    staticDirs: ["../public"],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-actions",
        "@chromatic-com/storybook",
    ],

    framework: {
        name: "@storybook/nextjs",
    },

    webpackFinal: async (config, { configType }) => {
        config.resolve.modules = [
            path.resolve(__dirname, "..", "src"),
            "node_modules",
        ];

        /**
         * Fixes issue with `next-i18next` and is ready for webpack@5
         * @see https://github.com/i18next/next-i18next/issues/1012#issuecomment-818042184
         */
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            vm: false,
        };
        config.externals["node:fs"] = "commonjs node:fs";

        return config;
    },
};
