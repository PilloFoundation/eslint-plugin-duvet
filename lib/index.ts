import fs from "fs";

import { TSESLint } from "@typescript-eslint/utils";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

import { ESLint } from "eslint";

import { rules } from "./rules";

type RuleKey = keyof typeof rules;
interface Plugin extends Omit<ESLint.Plugin, "rules" | "configs"> {
  rules: Record<RuleKey, RuleModule<any, any, any>>;
  configs: Record<string, TSESLint.FlatConfig.ConfigArray>;
}

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

const plugin: Plugin = {
  // preferred location of name and version
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules,
  configs: {},
};

plugin.configs["recommended"] = [
  {
    plugins: {
      "eslint-kint": plugin,
    },
    rules: {
      "eslint-kint/enforce-params-specified": "error",
    },
    languageOptions: {
      globals: {
        myGlobal: "readonly",
      },
    },
  },
];

export default plugin;
