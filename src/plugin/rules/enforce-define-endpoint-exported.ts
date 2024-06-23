import { ESLintUtils } from "@typescript-eslint/utils";

// TODO: Point to our rules documentation
export const createRule = ESLintUtils.RuleCreator(
  (name) => `https://my-website.io/eslint/${name}`
);

export default createRule({
  name: "enforce-define-endpoint-exported",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that a defineEndpoint function must be exported as default for the file",
    },
    messages: {
      "define-endpoint-not-exported":
        "Your endpoint file does not export the output of `defineEndpoint` as default",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let endpointDefined = false;
    let endpointDefinedLoc = {
      start: {
        line: 0,
        column: 0,
      },
      end: {
        line: 0,
        column: 0,
      },
    };
    let hasDefaultExport = false;

    return {
      CallExpression(node) {
        const { type, callee } = node;
        if (
          type === "CallExpression" &&
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callee.property.name === "defineEndpoint"
        ) {
          endpointDefined = true;
          endpointDefinedLoc = node.loc;
        }
      },
      ExportDefaultDeclaration(node) {
        hasDefaultExport = true;
      },
      "Program:exit"(node) {
        if (endpointDefined && !hasDefaultExport) {
          context.report({
            loc: endpointDefinedLoc,
            messageId: "define-endpoint-not-exported",
          });
        }
      },
    };
  },
});
