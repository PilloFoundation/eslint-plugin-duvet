import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

import baseConfig from "./base";

export default (plugin: FlatConfig.Plugin): FlatConfig.ConfigArray => [
  baseConfig(plugin),
  {
    name: "duvet-eslint/recommended",
    rules: {
      "@duvetjs/eslint-plugin-duvet/enforce-params-specified": "error",
    },
  },
];
