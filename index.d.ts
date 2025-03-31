import type { ESLint } from "eslint";

declare const formatter: (results: ESLint.LintResult[]) => string;

export default formatter;
