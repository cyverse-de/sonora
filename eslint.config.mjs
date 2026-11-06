// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import jsxA11y from "eslint-plugin-jsx-a11y";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
    ...nextCoreWebVitals,
    { rules: { ...jsxA11y.flatConfigs.recommended.rules } },
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
    {
        rules: {
            "@next/next/no-img-element": "off",
            // react-hooks v7 introduced set-state-in-effect; it flags existing
            // patterns that work correctly. Disable until the codebase is updated.
            "react-hooks/set-state-in-effect": "off",
        },
    },
    {
        files: ["stories/**/*.stories.js"],
        rules: {
            // Story components are intentionally defined inline
            "react-hooks/static-components": "off",
            "import/no-anonymous-default-export": [
                "warn",
                {
                    allowArray: false,
                    allowArrowFunction: false,
                    allowAnonymousClass: false,
                    allowAnonymousFunction: false,
                    allowCallExpression: true,
                    allowNew: false,
                    allowLiteral: false,
                    allowObject: true,
                },
            ],
        },
    },
    ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
