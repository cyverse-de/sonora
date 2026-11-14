module.exports = {
    presets: [
        [
            "next/babel",
            {
                "preset-env": {
                    targets: {
                        node: "current",
                    },
                },
                "preset-react": {
                    runtime: "automatic",
                },
            },
        ],
    ],
};
