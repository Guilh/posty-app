# Contributing to Posty

Thanks for your interest in improving Posty! This guide explains how to get set up, propose changes, and (most importantly) add new blog posts safely.

## Table of Contents
- [Project Philosophy](#project-philosophy)
- [Setup](#setup)
- [Development Workflow](#development-workflow)
- [Adding a New Post](#adding-a-new-post)
- [Front Matter Reference](#front-matter-reference)
- [Commit Messages](#commit-messages)
- [Branch Naming](#branch-naming)
- [Pull Requests](#pull-requests)
- [Issue Reports & Feature Requests](#issue-reports--feature-requests)
- [Code Style](#code-style)
- [Security](#security)

## Project Philosophy
Keep it: simple, fast to load, and easy to extend with small utilities (no heavy CMS). Markdown files in `posts/` are the source of truth.

## Setup
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Development Workflow
1. Create a branch off `main` (see naming below).
2. Make focused changes.
3. Run the server locally and manually test.
4. Commit with clear messages.
5. Open a Pull Request (PR) early if feedback is desired.

## Adding a New Post
You have two options:

### 1. Via the Web Form (Preferred for non-technical contributors)
1. Start dev server: `npm run dev`.
2. Visit `http://localhost:3000/new`.
3. Enter a Title and Content.
4. Submit – a new Markdown file is created in `posts/` using a slugified title.

### 2. Manually Creating the File
1. Create a new file inside `posts/` named after a slug version of your title, e.g.: `my-first-post.md`.
2. Add required front matter at the top:
   ```markdown
   ---
   title: My First Post
   date: 2025-08-25
   ---

   Your markdown content here.
   ```
3. Use ISO date format `YYYY-MM-DD`.
4. Avoid spaces or special characters in filenames; use lowercase and hyphens.
5. Save and refresh the homepage to confirm it appears.

### Content Guidelines
- Keep titles concise (< 60 chars).
- One H1 (`#`) in content max; prefer starting directly after front matter (the site may generate its own heading).
- Use standard Markdown; embedded HTML is sanitized.
- Images: use absolute or relative paths. Ensure assets are licensed.
- Avoid large files (> 1 MB) committed to repo.

## Front Matter Reference
| Field | Required | Example | Notes |
|-------|----------|---------|-------|
| `title` | Yes | `"Understanding Slugs"` | Display title |
| `date` | Yes | `2025-08-25` | Publication date, ISO format |
| `tags` | Optional | `[tutorial, node]` | Future use (not yet rendered) |
| `draft` | Optional | `true` | If present & true, consider not listing (future feature) |

## Commit Messages
Follow this lightweight convention:
```
<type>: <short description>
```
Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`.

Examples:
- `docs: add contributing guide`
- `feat: support tags in post metadata`

## Branch Naming
```
<type>/<short-kebab-description>
```
Examples: `docs/add-contributing-guide`, `feat/tag-filtering`.

## Pull Requests
- Keep PRs small & focused.
- Reference related issues (e.g., `Closes #1`).
- Describe what changed, why, and testing steps.
- Ensure no debug/console noise unless purposeful.

## Issue Reports & Feature Requests
Include:
- What happened vs expected.
- Steps to reproduce.
- Environment (Node version, OS) if relevant.
- For features: problem statement & value.

## Code Style
The project currently has minimal enforced styling—aim for:
- Modern ES module syntax (`import`/`export`).
- Consistent 2-space indentation.
- Descriptive variable names.
- Keep functions small.

(We can add ESLint/Prettier later; feel free to propose.)

## Security
- User-submitted content is sanitized with `sanitize-html`.
- Do not introduce features that allow arbitrary file writes outside `posts/`.
- Report vulnerabilities privately first if sensitive.

---
Thanks for helping make Posty better! 🎉
