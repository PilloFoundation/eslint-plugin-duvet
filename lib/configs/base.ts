import { ClassicConfig } from "@typescript-eslint/utils/ts-eslint";

export = {
  parserOptions: { sourceType: "module" },
  plugins: ["@duvetjs/eslint-plugin-duvet"],
} satisfies ClassicConfig.Config;
