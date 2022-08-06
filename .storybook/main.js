// .storybook/main.js
const path = require("path");
module.exports = {
    stories: ["../stories/**/*.stories.@(js|mdx)"],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-actions",
        "storybook-addon-next-router",
    ],
    // framework: "@storybook/react",
    // core: {
    //     builder: "webpack5",
    // },
    webpackFinal: async (config, { configType }) => {
        config.resolve.modules = [
            path.resolve(__dirname, "..", "src"),
            "node_modules",
        ];

        /**
         * Fixes issue with `next-i18next` and is ready for webpack@5
         * @see https://github.com/i18next/next-i18next/issues/1012#issuecomment-818042184
         */
        // config.resolve.fallback = {
        //     ...config.resolve.fallback,
        //     fs: false,
        //     tls: false,
        //     net: false,
        //     module: false,
        //     // path: require.resolve("path-browserify"),
        // };

        return config;
    },
};
