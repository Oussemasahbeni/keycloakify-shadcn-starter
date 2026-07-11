//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
    ...tanstackConfig,
    ...pluginQuery.configs["flat/recommended-strict"],
    {
        // Pin the type-aware parser to this package's tsconfig so linting resolves
        // correctly regardless of the ESLint process cwd (e.g. the VSCode ESLint
        // extension running from another workspace package in this monorepo).
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            "import/no-cycle": "off",
            "import/order": "off",
            "sort-imports": "off",
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/require-await": "off",
            "pnpm/json-enforce-catalog": "off",
        },
    },
    {
        ignores: ["eslint.config.js", "prettier.config.js"],
    },
];
