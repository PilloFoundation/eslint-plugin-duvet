import { TSESLint } from "@typescript-eslint/utils";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

import { ESLint } from "eslint";

import { rules } from "./rules";

type RuleKey = keyof typeof rules;
interface Plugin extends Omit<ESLint.Plugin, "rules" | "configs"> {
  rules: Record<RuleKey, RuleModule<any, any, any>>;
  configs: Record<string, TSESLint.FlatConfig.ConfigArray>;
}

const plugin: Plugin = {
  // preferred location of name and version
  meta: {
    name: "@duvetjs/eslint-plugin-duvet",
    version: "0.0.7",
  },
  rules,
  configs: {},
};

plugin.configs["recommended"] = [
  {
    plugins: {
      "eslint-duvet": plugin,
    },
    rules: {
      "eslint-duvet/enforce-params-specified": "error",
    },
    languageOptions: {
      globals: {
        myGlobal: "readonly",
      },
    },
  },
];

export default plugin;
