const fs = require("fs");

const paramsRules = require("./enforce-params-specified");

const pkg = JSON.parse(
  fs.readFileSync(
    new URL(
      "./package.json",
      require("url").pathToFileURL(__filename).toString()
    ),
    "utf8"
  )
);

const plugin = {
  // preferred location of name and version
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "enforce-params-specified": paramsRules,
  },
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: [
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
  ],
});

module.exports = plugin;
