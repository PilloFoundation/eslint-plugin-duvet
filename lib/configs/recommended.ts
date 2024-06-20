import type { ClassicConfig } from "@typescript-eslint/utils/ts-eslint";

export = {
  extends: ["./configs/base"],
  rules: {
    "eslint-duvet/enforce-params-specified": "error",
  },
} satisfies ClassicConfig.Config;
