import { Linter } from "@typescript-eslint/utils/ts-eslint";
import { enforceParamsSpecified } from "./rules/enforce-params-specified";

// Must stay require not import
const { name, version } = require("../../package.json") as {
  name: string;
  version: string;
};

export = {
  meta: {
    name: name,
    version: version,
  },
  rules: {
    "enforce-params-specified": enforceParamsSpecified,
  },
} satisfies Linter.Plugin;
