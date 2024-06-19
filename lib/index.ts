import fs from "fs";

import { RuleModule } from "@typescript-eslint/utils/ts-eslint";
import { ESLint } from "eslint";

import { rules } from "./rules";

type RuleKey = keyof typeof rules;

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  rules: Record<RuleKey, RuleModule<any, any, any>>;
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
};

// assign configs here so we can reference `plugin`
plugin.configs = {
  recommended: [
    {
      plugins: {
        "eslint-kint": plugin as unknown as ESLint.Plugin, // Because of the Plugin interface decleared earlier
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
  ],
};

export default plugin;
