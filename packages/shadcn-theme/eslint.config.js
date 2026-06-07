import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    eslintConfigPrettier,
    ...storybook.configs["flat/recommended"],
    {
        ignores: ["dist/**", "public/**"],
    },
    {
        plugins: {
            "react-refresh": reactRefresh,
            "react-hooks": reactHooks,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            "react-hooks/exhaustive-deps": "off",
            "@typescript-eslint/no-redeclare": "off",
            "no-labels": "off",
        },
    },
    {
        files: ["**/*.stories.*"],
        rules: {
            "import/no-anonymous-default-export": "off",
        },
    },
);
