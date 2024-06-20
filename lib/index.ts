import { Linter } from "@typescript-eslint/utils/ts-eslint";

import base from "./configs/base";
import recommended from "./configs/recommended";

import { rules } from "./rules";

export = {
  meta: {
    name: "@duvetjs/eslint-plugin-duvet",
    version: "0.0.13",
  },
  configs: {
    base,
    recommended,
  },
  rules,
} satisfies Linter.Plugin;
