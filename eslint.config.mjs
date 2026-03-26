import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
    js.configs.recommended,
    {
        files: ["web.js"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["static/**/*.js"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "script",
            globals: {
                ...globals.browser,
                ...globals.jquery,
                getConfig: "readonly",
            },
        },
    },
    {
        files: ["static/config.js"],
        rules: {
            "no-unused-vars": "off",
            "no-redeclare": "off",
        },
    },
    {
        ignores: ["eslint.config.mjs", "node_modules/**"],
    },
]);
