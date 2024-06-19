const VALID_VALIDATORS = ["zodValidator"];

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

    return {
      // Performs action in the function on every variable declarator
      CallExpression(node) {
        const { callee, arguments } = node;

        if (callee?.property?.name === "defineEndpoint") {
          console.log(arguments);
        }
      },
    };
  },
};
