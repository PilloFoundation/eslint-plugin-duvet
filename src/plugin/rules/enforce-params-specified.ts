import { TSESTree } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";

const VALIDATORS = {
  zodValidator: (
    requiredParams: string[],
    args: TSESTree.CallExpressionArgument[]
  ): {
    missingParams: string[];
    extraParams?: string[];
  } => {
    if (args.length !== 1 || args[0].type !== "ObjectExpression") {
      return { missingParams: requiredParams };
    }

    const argProperties = args[0].properties;

    // Find the params property in zodValidator
    const paramsProperty: TSESTree.Property | undefined = argProperties.find(
      (property): property is TSESTree.Property =>
        property.type === "Property" &&
        property.key.type === "Identifier" &&
        property.key.name === "params"
    );

    if (!paramsProperty) {
      return { missingParams: requiredParams };
    }

    // Assert that the params property is an z.object
    if (
      paramsProperty.value.type !== "CallExpression" ||
      paramsProperty.value.callee.type !== "MemberExpression" ||
      paramsProperty.value.callee.object.type !== "Identifier" ||
      paramsProperty.value.callee.object.name !== "z" ||
      paramsProperty.value.callee.property.type !== "Identifier" ||
      paramsProperty.value.callee.property.name !== "object"
    ) {
      return { missingParams: requiredParams };
    }

    // Now we can safely assume that the params property is an z.object and grab it's schema
    const schema = paramsProperty.value.arguments[0];
    if (schema.type !== "ObjectExpression") {
      return { missingParams: requiredParams };
    }

    const schemaProperties = schema.properties as TSESTree.Property[];

    // Get the keys of the schema properties
    const schemaKeys = schemaProperties
      .map((property: TSESTree.Property) => {
        if (property.key.type !== "Identifier") {
          return undefined; // TODO: See what happens with Computed properties
        }
        return property.key.name;
      })
      .filter((key): key is string => key !== undefined);

    const missingParams = requiredParams.filter((param) => {
      return !schemaKeys.some((key) => key === param);
    });

    const extraParams = schemaKeys.filter((key) => {
      return !requiredParams.some((param) => param === key);
    });

    return { missingParams, extraParams };
  },
} as const;

/**
 * Get the custom parameters from the filename. That duvet will extract
 * @param {string} filename
 * @returns
 */
function extractCustomParamsFromFilename(filename: string) {
  const regex = /\[([a-zA-Z-_]+)\]/g;
  const matches = [...filename.matchAll(regex)].map((match) => match[1]);
  return matches;
}

// TODO: Point to our rules documentation
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://my-website.io/eslint/${name}`
);

export default createRule({
  name: "enforce-params-specified",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that a defineEndpoint function must have the types of it's generic URL parameters specified.",
    },
    messages: {
      "missing-params":
        'Missing required URL parameters in {{validatorName}}: ["{{missingParams}}"]',
      "extra-params":
        'Extra URL parameters found in {{validatorName}}: ["{{extraParams}}"]',
      "no-validator":
        "No validator found for defineEndpoint. Please provide a validator for the generic URL parameters.",
      "duplicate-params":
        "Duplicate parameters in endpoint path. Please remove duplicates.",
    },
    schema: [],
  },
  defaultOptions: [],
  create: (context) => {
    const filename = context.filename;
    const customParams = extractCustomParamsFromFilename(filename);
    const isDuplicateParams =
      new Set(customParams).size !== customParams.length;

    return {
      CallExpression: (node) => {
        if (customParams.length === 0) {
          // No custom parameters to enforce
          return;
        }

        if (isDuplicateParams) {
          context.report({
            node,
            messageId: "duplicate-params",
          });
          return;
        }

        const { type, callee, arguments: args } = node;
        if (
          type === "CallExpression" &&
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "defineEndpoint"
        ) {
          // Find the validator argument
          const validatorArg = args.find((arg) => {
            if (
              arg.type !== "CallExpression" ||
              arg.callee.type !== "Identifier"
            ) {
              return false;
            }
            return Object.keys(VALIDATORS).includes(arg.callee.name);
          });

          if (!validatorArg) {
            context.report({
              node,
              messageId: "no-validator",
            });
            return;
          }

          // Same validation as above, but with a different error message (must do for type-checker)
          if (
            validatorArg.type !== "CallExpression" ||
            validatorArg.callee.type !== "Identifier"
          ) {
            throw new Error("Should not happen.");
          }

          // Assert that the validator has the correctly named arguments
          const validatorName = validatorArg.callee
            .name as keyof typeof VALIDATORS;
          const validatorValidator = VALIDATORS[validatorName];

          const { missingParams, extraParams } = validatorValidator(
            customParams,
            validatorArg.arguments
          );

          if (missingParams.length > 0) {
            context.report({
              loc: validatorArg.loc,
              messageId: "missing-params",
              data: {
                validatorName: validatorName,
                missingParams: missingParams.join(", "),
              },
            });
          }

          if (extraParams && extraParams.length > 0) {
            context.report({
              loc: validatorArg.loc,
              messageId: "extra-params",
              data: {
                validatorName: validatorName,
                extraParams: extraParams.join(", "),
              },
            });
          }
        }
      },
    };
  },
});
