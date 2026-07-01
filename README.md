# PromptLibrary

A free library of ready-to-use AI prompts for solopreneurs and small business owners.

Built with Next.js 14, TypeScript, Tailwind CSS, and Fuse.js. Deploys as a fully static site to Vercel or Netlify.

---

## Adding new prompts

All prompts live in `/data/prompts.json`. Add a new object to the array to publish a new prompt. No code changes needed.

### Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✓ | URL slug — kebab-case, unique across all prompts |
| `title` | `string` | ✓ | Short descriptive title shown on cards and the detail page |
| `categoryId` | `string` | ✓ | Must match an `id` in `categories.json` |
| `subcategoryId` | `string` | ✓ | Must match a `subcategories[].id` within the chosen category |
| `aiTool` | `"ChatGPT" \| "Claude" \| "Gemini" \| "Midjourney"` | ✓ | The recommended AI tool for this prompt |
| `promptText` | `string` | ✓ | The full prompt. Mark variables with `[ALL CAPS IN BRACKETS]` |
| `description` | `string` | ✓ | One sentence — shown on cards and used as the meta description |
| `useCase` | `string` | ✓ | A short paragraph explaining when and why to use this prompt |
| `variables` | `string[]` | ✓ | Variable names from `promptText`, written **without** brackets |
| `relatedPromptIds` | `string[]` | ✓ | Up to 3 other prompt `id` values (can be an empty array `[]`) |

### Example

```json
{
  "id": "weekly-content-plan",
  "title": "Weekly Content Plan Generator",
  "categoryId": "content-creation",
  "subcategoryId": "content-calendars",
  "aiTool": "ChatGPT",
  "promptText": "Create a 7-day social media content plan for [BUSINESS TYPE] targeting [TARGET AUDIENCE]. For each day, suggest one post idea for [PLATFORM] with a topic, hook, and format (e.g. carousel, video, text post). Align the week around this theme: [WEEKLY THEME].",
  "description": "Generate a structured 7-day social media plan tailored to your business and audience.",
  "useCase": "Use this at the start of each week to plan your content in one session. The more specific you are about your weekly theme, the more cohesive the output will be across all seven posts.",
  "variables": ["BUSINESS TYPE", "TARGET AUDIENCE", "PLATFORM", "WEEKLY THEME"],
  "relatedPromptIds": ["instagram-caption-generator", "facebook-ad-copy", "seo-blog-post-outline"]
}
```

### Rules

- **`id` must be unique.** Duplicate IDs cause a build error.
- **`variables` must match `promptText`.** Each item in `variables` should appear in `promptText` surrounded by brackets — e.g. `"YOUR PRODUCT"` in `variables` → `[YOUR PRODUCT]` in `promptText`.
- **`relatedPromptIds` must be valid.** Each ID must exist in `prompts.json`, or the related card silently won't appear.

### Categories and subcategory IDs

| Category | `categoryId` | Example subcategory IDs |
|----------|-------------|------------------------|
| Marketing | `marketing` | `social-media-captions`, `email-newsletters`, `ad-copy` |
| Sales | `sales` | `cold-outreach-emails`, `objection-handling`, `discovery-call-questions` |
| Content Creation | `content-creation` | `blog-post-outlines`, `seo-titles-and-meta-descriptions`, `podcast-show-notes` |
| Product and Business Ideas | `product-and-business-ideas` | `brainstorming-offers`, `validating-ideas`, `pricing-strategy` |
| Customer Service | `customer-service` | `responding-to-reviews`, `refund-and-complaint-handling`, `onboarding-emails` |
| Productivity and Operations | `productivity-and-operations` | `sop-writing`, `meeting-notes-and-summaries`, `hiring-and-job-posts` |
| Visual and Design | `visual-and-design` | `logo-and-brand-concepts`, `social-media-graphics`, `ad-creative-concepts` |

All valid subcategory IDs are in `/data/categories.json`. To add a new subcategory, append to the relevant category's `subcategories` array:

```json
{ "id": "new-subcategory-id", "name": "New Subcategory Name" }
```

---

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Preview the production static export:

```bash
npm run build   # generates /out directory
npx serve out
```

---

## Deploying to Vercel (recommended)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Framework preset is auto-detected as **Next.js** — no extra configuration needed
5. Click **Deploy**

Vercel detects `output: "export"` in `next.config.mjs` and serves the `out/` directory automatically.

### Custom domain on Vercel

1. In your project dashboard → **Settings → Domains**
2. Click **Add Domain** and enter your domain (e.g. `promptlibrary.com`)
3. Vercel provides DNS records — add either:
   - A **CNAME** pointing to `cname.vercel-dns.com` (subdomains), or
   - An **A record** pointing to Vercel's IP (apex domain like `example.com`)
4. Add these in your registrar's DNS settings
5. Vercel provisions HTTPS automatically within minutes

### Environment variable for the sitemap URL

Set `NEXT_PUBLIC_SITE_URL` so the sitemap and Open Graph tags use your real domain:

1. **Settings → Environment Variables**
2. Add: `NEXT_PUBLIC_SITE_URL` → `https://yourdomain.com`
3. Redeploy

---

## Deploying to Netlify

1. **Add new site → Import an existing project** → connect GitHub
2. Build command: `npm run build`
3. Publish directory: `out`
4. Deploy

---

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production URL for sitemap and OG tags | `https://promptlibrary.vercel.app` |

---

## Replacing the favicon

Replace `app/favicon.ico` (32×32 ICO) and `public/favicon.svg` (SVG for modern browsers). Both are referenced in `app/layout.tsx` under `metadata.icons`.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org) | Framework — App Router, static export |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Typography |
| [Fuse.js](https://fusejs.io) | Client-side fuzzy search |
