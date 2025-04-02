# eslint-formatter-bullseye

```
██████╗ ██╗   ██╗██╗     ██╗     ███████╗███████╗██╗   ██╗███████╗██╗
██╔══██╗██║   ██║██║     ██║     ██╔════╝██╔════╝╚██╗ ██╔╝██╔════╝██║
██████╔╝██║   ██║██║     ██║     ███████╗█████╗   ╚████╔╝ █████╗  ██║
██╔══██╗██║   ██║██║     ██║     ╚════██║██╔══╝    ╚██╔╝  ██╔══╝  ╚═╝
██████╔╝╚██████╔╝███████╗███████╗███████║███████╗   ██║   ███████╗██╗
╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝╚═╝
```

> A beautiful and concise ESLint formatter with clear, easy-to-read output

![npm version](https://img.shields.io/npm/v/eslint-formatter-bullseye?style=for-the-badge)
![NPM License](https://img.shields.io/npm/l/eslint-formatter-bullseye?style=for-the-badge)

## Screenshot

![image](https://github.com/user-attachments/assets/cff417ca-b0d3-4c5f-b727-33aae3884804)


## Features

- 🎯 Clear, concise output format
- 🎨 Beautiful color-coded messages
- 📍 Unix-style line:column references
- 🔍 Precise error location with carets
- 📝 Grouped warnings and errors
- 📊 Clean summary report

## Install

```bash
npm install --save-dev eslint-formatter-bullseye
# or
yarn add -D eslint-formatter-bullseye
```

## Usage

### Command Line

```bash
eslint . --format eslint-formatter-bullseye
```

### ESLint Config

In your `.eslintrc`:

```json
{
  "formatter": "eslint-formatter-bullseye"
}
```

### Output Example

```
╔══════════════╗
║  WARNINGS    ║
╚══════════════╝
🟡 index.js:22:5 | console.log('debug') | no-console
                   ^

╔══════════════╗
║   ERRORS     ║
╚══════════════╝
🔴 index.js:15:3 | const unused = 'value' | no-unused-vars
                   ^

╔══════════════╗
║   SUMMARY    ║
╚══════════════╝
🔴 Errors detected: 1
🟡 Warnings identified: 1
```

## License

MIT © [Ben Glasser](https://benglasser.com)
