# prompt-library

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Fuse.js for client-side search — no backend, no database, no auth
- Fully static site; deploys via GitHub → Vercel auto-deploy on push to `main`

## Data model

- `data/prompts.json` is a single flat array and the **source of truth** for all prompts.
- `data/categories.json` defines 20 categories, each with a `subcategories` array — 114 subcategories total across the file.

### Prompt object schema (`data/prompts.json`)

```json
{
  "id": "kebab-case-unique-id",
  "title": "Human Readable Title",
  "categoryId": "must match an id in categories.json",
  "subcategoryId": "must match a subcategory id under that category",
  "aiTool": "Claude | ChatGPT | Grok | ...",
  "promptText": "The full prompt, with [VARIABLES] in brackets",
  "description": "One-line description",
  "useCase": "When/why to use this prompt",
  "variables": ["VARIABLE ONE", "VARIABLE TWO"],
  "relatedPromptIds": ["other-prompt-id", "another-prompt-id"]
}
```

## Standing workflow: adding a batch of prompts

Prompts are added in batches (~24 per subcategory, one subcategory at a time, across 114 subcategories). For every batch, follow this workflow exactly:

1. Append the batch to the array in `data/prompts.json`.
2. Validate the resulting JSON parses.
3. Scan **every** new id in the batch against the full existing `prompts.json` for collisions — check all of them, don't stop at the first hit. Report any collisions and ask before resolving.
4. Verify every `relatedPromptIds` reference in the batch resolves to an id that exists (in the existing file or elsewhere in the batch).
5. Run `npm run build` and confirm it compiles.
6. Report the before/after prompt count.

**Do not commit.** The user runs the git commands themselves.
