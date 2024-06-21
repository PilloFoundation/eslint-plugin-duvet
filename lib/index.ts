import { Linter } from "@typescript-eslint/utils/ts-eslint";
import { enforceParamsSpecified } from "./rules/enforce-params-specified";

export = {
  meta: {
    name: "@duvetjs/eslint-plugin-duvet",
    version: "0.0.21",
  },
  rules: {
    "@duvetjs/eslint-plugin-duvet/enforce-params-specified":
      enforceParamsSpecified,
  },
  configs: {
    recommended: {
      plugins: ["@duvetjs/eslint-plugin-duvet"],
      rules: {
        "@duvetjs/eslint-plugin-duvet/enforce-params-specified": "error",
      },
    },
  },
} satisfies Linter.Plugin;
