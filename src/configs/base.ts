import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

export default (plugin: FlatConfig.Plugin): FlatConfig.Config => ({
  name: "duvet-eslint/base",
  languageOptions: {
    sourceType: "module",
  },
  plugins: {
    "@duvetjs/eslint-plugin-duvet": plugin,
  },
});
