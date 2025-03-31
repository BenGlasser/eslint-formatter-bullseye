import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

const EMOJIS = {
  error: "🔴",
  warning: "🟡",
};

const CLEAN_ASCII = `
██████╗ ██╗   ██╗██╗     ██╗     ███████╗███████╗██╗   ██╗███████╗██╗
██╔══██╗██║   ██║██║     ██║     ██╔════╝██╔════╝╚██╗ ██╔╝██╔════╝██║
██████╔╝██║   ██║██║     ██║     ███████╗█████╗   ╚████╔╝ █████╗  ██║
██╔══██╗██║   ██║██║     ██║     ╚════██║██╔══╝    ╚██╔╝  ██╔══╝  ╚═╝
██████╔╝╚██████╔╝███████╗███████╗███████║███████╗   ██║   ███████╗██╗
╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝╚═╝
`;

// Cache for file contents to prevent multiple reads
const fileCache = new Map();

function getLineFromFile(filePath, lineNumber) {
  try {
    if (!fileCache.has(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      fileCache.set(filePath, fileContent.split("\n"));
    }

    const lines = fileCache.get(filePath);
    return lines[lineNumber - 1] || "";
  } catch {
    return "";
  }
}

function getRelativePath(filePath) {
  const currentModulePath = new URL(import.meta.url).pathname;
  const currentDir = path.dirname(currentModulePath);
  return path.relative(currentDir, filePath);
}

function stripAnsi(string_) {
  // ANSI color codes are control characters that don't affect string length
  // String.trim() only removes whitespace, not control characters
  return string_.replaceAll(/\[(?:\d{1,2}(?:;\d{1,2})*)?m/g, "");
}

function createCaretLine(prefix, originalLine, trimmedLine, column) {
  const leadingSpaces = originalLine.length - originalLine.trimStart().length;
  const strippedPrefix = stripAnsi(prefix);
  const lineContentStart = strippedPrefix.length + 3; // Account for " | " separator
  return (
    " ".repeat(lineContentStart) +
    " ".repeat(column - leadingSpaces - 1) +
    chalk.red("^")
  );
}

function createHackerHeader(text, color) {
  const strippedText = stripAnsi(text);
  const border = "═".repeat(strippedText.length + 4);
  const coloredBorder = chalk[color].bold;
  return `${coloredBorder(`╔${border}╗`)}
${coloredBorder(`║ ${chalk.bold(text)}   ║`)}
${coloredBorder(`╚${border}╝`)}`;
}

function formatMessage(filePath, message) {
  const { line, column, ruleId, severity } = message;
  const originalLine = getLineFromFile(filePath, line);
  const trimmedLine = originalLine.trim();
  const emoji = severity === 2 ? EMOJIS.error : EMOJIS.warning;

  const prefix = `${emoji} ${chalk.cyan(filePath)}${chalk.yellow(`:${line}:${column}`)}`;
  const parts = [prefix, chalk.green(trimmedLine), chalk.red(ruleId)];
  let output = parts.join(" | ") + "\n";
  output += createCaretLine(prefix, originalLine, trimmedLine, column) + "\n";
  return output;
}

export default function eslintFormatterBullseye(results) {
  let output = "\n";
  let errorCount = 0;
  let warningCount = 0;

  // Clear the cache before processing new results
  fileCache.clear();

  // Group messages by severity and file
  const warnings = new Map();
  const errors = new Map();

  for (const result of results) {
    const filePath = getRelativePath(result.filePath);

    for (const message of result.messages) {
      if (message.severity === 1) {
        warningCount++;
        if (!warnings.has(filePath)) {
          warnings.set(filePath, []);
        }

        warnings.get(filePath).push(message);
      } else {
        errorCount++;
        if (!errors.has(filePath)) {
          errors.set(filePath, []);
        }

        errors.get(filePath).push(message);
      }
    }
  }

  // If no issues, show the success ASCII art
  if (errorCount === 0 && warningCount === 0) {
    return `\n${chalk.green(CLEAN_ASCII)}\n${chalk.cyan("✨ All systems operational! Code is clean. ✨")}\n`;
  }

  // Warnings Section
  if (warningCount > 0) {
    output += createHackerHeader("  WARNINGS ", "yellow") + "\n";
    for (const [filePath, messages] of warnings) {
      for (const message of messages) {
        output += formatMessage(filePath, message);
      }
    }
  }

  // Errors Section
  if (errorCount > 0) {
    output += createHackerHeader("  ERRORS ", "red") + "\n";
    for (const [filePath, messages] of errors) {
      for (const message of messages) {
        output += formatMessage(filePath, message);
      }
    }
  }

  // Summary
  output += createHackerHeader("  SUMMARY ", "cyan") + "\n";
  output += `${EMOJIS.error} ${chalk.red("Errors detected:")} ${errorCount}\n`;
  output += `${EMOJIS.warning} ${chalk.yellow("Warnings identified:")} ${warningCount}\n`;

  return output;
}
