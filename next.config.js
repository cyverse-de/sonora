const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
    experimental: {
        forceSwcTransforms: true,
    },
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/dashboard",
            },
        ];
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        return config;
    },
    turbopack: {},
    i18n,
});
