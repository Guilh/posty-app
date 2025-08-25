# Posty

Simple Node.js blog that serves Markdown posts from a folder.

## Quick Start

1. Install dependencies
2. Run the dev server
3. Open in browser and create posts

### Install

```bash
npm install
```

### Run

```bash
npm run start
# or live reload
npm run dev
```

Visit: http://localhost:3000

## Adding Posts Manually

Create a new `.md` file inside `posts/` with front matter:

```markdown
---
title: Your Title
date: 2025-08-25
---

Markdown content here.
```

It will appear on the homepage list.

## Form-Based Creation

Go to `/new` to use the built-in form. Title is turned into a slug file name.

## Security Notes

- Sanitizes HTML output using `sanitize-html`.
- Only whitelists standard tags plus `img`.

## Future Ideas

- Tag metadata
- Search
- Editing posts
- Pagination

Enjoy!
