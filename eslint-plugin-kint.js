import fs from "fs";

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

const plugin = {
  // preferred location of name and version
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    // add rules here
  },
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        example: plugin,
      },
      rules: {
        "example/dollar-sign": "error",
      },
      languageOptions: {
        globals: {
          myGlobal: "readonly",
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ],
});

export default plugin;
