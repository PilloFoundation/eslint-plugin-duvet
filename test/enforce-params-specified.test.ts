import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../src/plugin/rules/enforce-params-specified";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

ruleTester.run("@duvetjs/eslint-plugin-duvet/enforce-params-specified", rule, {
  valid: [
    // Base cases from https://github.com/typescript-eslint/typescript-eslint/issues/2323#issuecomment-663977655
    {
      code: `export default duvet.defineEndpoint(
          {},
          zodValidator({
            params: z.object({ test: z.coerce.number() }),
          }),
          (request, k) => {
            // Returns the value of the "test" query parameter.
            return new DuvetResponse(k.valid.params.test.toString(), 200);
          },
        );`,
    },
  ],
  invalid: [
    // Base cases from https://github.com/typescript-eslint/typescript-eslint/issues/2323#issuecomment-663977655
    // {
    //   code: "let a: Array<number> = [];",
    //   output: "let a: number[] = [];",
    //   errors: [
    //     {
    //       messageId: "errorStringArray",
    //       data: { className: "Array", readonlyPrefix: "", type: "number" },
    //       line: 1,
    //       column: 8,
    //     },
    //   ],
    // },
  ],
});
