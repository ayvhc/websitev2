# Yihung Chen Portfolio

Yihung Chen's personal portfolio, covering engineering, early-stage investing,
professional experience, personal interests, and contact information.

## Pages

- `/` — interactive introduction and investment philosophy
- `/investment` — investing approach
- `/experience` — professional, research, and education history
- `/about` — personal profile and interactive mood board
- `/contact` — contact information
- `/journey` — private timeline

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
npm test
```

`npm test` produces the Sites deployment build and runs the server-rendering
smoke tests. The project is configured for OpenAI Sites through
`.openai/hosting.json`.
