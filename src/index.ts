import pluginBase from "./plugin";
// see the comment in config-helper.ts for why this doesn't use /ts-eslint
import type { TSESLint } from "@typescript-eslint/utils";

import type { ConfigWithExtends } from "./config-helper";
import { config } from "./config-helper";
import baseConfig from "./configs/base";
import recommendedConfig from "./configs/recommended";

/*
we could build a plugin object here without the `configs` key - but if we do
that then we create a situation in which
```
require('typescript-eslint').plugin !== require('@typescript-eslint/eslint-plugin')
```

This is bad because it means that 3rd party configs would be required to use
`typescript-eslint` or else they would break a user's config if the user either
used `tseslint.configs.recomended` et al or
```
{
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
}
```

This might be something we could consider okay (eg 3rd party flat configs must
use our new package); however legacy configs consumed via `@eslint/eslintrc`
would never be able to satisfy this constraint and thus users would be blocked
from using them.
*/
const plugin: TSESLint.FlatConfig.Plugin = pluginBase as Omit<
  typeof pluginBase,
  "configs"
>;

const configs = {
  base: baseConfig(plugin),
  recommended: recommendedConfig(plugin),
};

export type Config = TSESLint.FlatConfig.ConfigFile;
export type { ConfigWithExtends };
/*
eslint-disable-next-line import/no-default-export --
we do both a default and named exports to allow people to use this package from
both CJS and ESM in very natural ways.

EG it means that all of the following are valid:

```ts
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
);
```
```ts
import { config, parser, plugin } from 'typescript-eslint';

export default config(
  {
    languageOptions: { parser }
    plugins: { ts: plugin },
  }
);
```
```ts
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
);
```
```ts
const { config, parser, plugin } = require('typescript-eslint');

module.exports = config(
  {
    languageOptions: { parser }
    plugins: { ts: plugin },
  }
);
```
*/
export default {
  config,
  configs,
  plugin,
};
export { config, configs, plugin };
