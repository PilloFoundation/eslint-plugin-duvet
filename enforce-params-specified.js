const VALIDATORS = {
  zodValidator: (requiredParams, args) => {
    if (args.length !== 1 || args[0].type !== "ObjectExpression") {
      return requiredParams;
    }

    const argProperties = args[0].properties;

    // Find the params property in zodValidator
    const paramsProperty = argProperties.find(
      (property) => property.key.name === "params"
    );
    if (!paramsProperty) {
      return requiredParams;
    }

    // Assert that the params property is an z.object
    if (
      paramsProperty.value.type !== "CallExpression" ||
      paramsProperty.value.callee.object.name !== "z" ||
      paramsProperty.value.callee.property.name !== "object"
    ) {
      return requiredParams;
    }

    // Now we can safely assume that the params property is an z.object and grab it's schema
    const schema = paramsProperty.value.arguments[0];
    if (schema.type !== "ObjectExpression") {
      return requiredParams;
    }
    const schemaProperties = schema.properties;

    // Get the keys of the schema properties
    const schemaKeys = schemaProperties.map((property) => property.key.name);

    const missingParams = requiredParams.filter((param) => {
      return !schemaKeys.some((key) => key === param);
    });

    const extraParams = schemaKeys.filter((key) => {
      return !requiredParams.some((param) => param === key);
    });

    return { missingParams, extraParams };
  },
};

/**
 * Get the custom parameters from the filename/
 * @param {string} filename
 * @returns
 */
function extractCustomParamsFromFilename(filename) {
  const regex = /\[([a-zA-Z-_]+)\]/g;
  const matches = [...filename.matchAll(regex)].map((match) => match[1]);
  return matches;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that a defineEndpoint function must have the types of it's generic URL parameters specified.",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    const filename = context.getFilename();
    const customParams = extractCustomParamsFromFilename(filename);
    const isDuplicateParams =
      new Set(customParams).size !== customParams.length;

    return {
      CallExpression(node) {
        if (customParams.length === 0) {
          // No custom parameters to enforce
          return;
        }

        if (isDuplicateParams) {
          context.report({
            node,
            message:
              "Duplicate parameters in endpoint path. Please remove duplicates.",
          });
          return;
        }

        const { callee, arguments } = node;
        if (callee?.property?.name === "defineEndpoint") {
          // Find the validator argument
          const validatorArg = arguments.find((arg) => {
            if (arg.type !== "CallExpression") {
              return false;
            }
            console.log(arg.callee.name);
            return Object.keys(VALIDATORS).includes(arg.callee.name);
          });

          if (!validatorArg) {
            context.report({
              node,
              message:
                "No validator found for defineEndpoint. Please provide a validator for the generic URL parameters.",
            });
            return;
          }

          // Assert that the validator has the correctly named arguments
          const validatorName = validatorArg.callee.name;
          const validatorValidator = VALIDATORS[validatorName];

          const { missingParams, extraParams } = validatorValidator(
            customParams,
            validatorArg.arguments
          );

          if (missingParams.length > 0) {
            context.report({
              loc: validatorArg.loc,
              message: `Missing required URL parameters in ${validatorName}: [${missingParams.join(
                ", "
              )}]`,
            });
          }

          if (extraParams.length > 0) {
            context.report({
              loc: validatorArg.loc,
              message: `Extra URL parameters found in ${validatorName}: ["${extraParams.join(
                '", "'
              )}"]`,
            });
          }
        }
      },
    };
  },
};
