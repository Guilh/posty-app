import express from 'express';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const POSTS_DIR = path.join(__dirname, '..', 'posts');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function loadPost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, ...data, content };
}

function listPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const slug = f.replace(/\.md$/, '');
      return loadPost(slug);
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function renderLayout(title, body) {
  return `<!doctype html>
  <html lang='en'>
  <head>
    <meta charset='utf-8'/>
    <title>${title} · Posty</title>
    <meta name='viewport' content='width=device-width,initial-scale=1'/>
    <meta name='color-scheme' content='dark light'>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <link rel='stylesheet' href='/styles.css'/>
  </head>
  <body>
    <header>
      <nav class='navbar'>
        <div class='brand'><a href='/'>Posty</a></div>
        <ul class='nav-links'>
          <li><a href='/'>Home</a></li>
          <li><a href='/new'>New</a></li>
          <li><a href='https://github.com' target='_blank' rel='noopener'>Repo</a></li>
        </ul>
      </nav>
    </header>
    <main>${body}</main>
    <footer><p>Built with Markdown · <a href='/'>Posty</a></p></footer>
    <script src='/script.js' defer></script>
  </body>
  </html>`;
}

app.get('/', (req, res) => {
  const posts = listPosts();
  const cards = posts.map(p => `
    <div class='card fade-in'>
      <h3><a href='/post/${p.slug}'>${p.title || p.slug}</a></h3>
      ${p.date ? `<small>${p.date}</small>` : ''}
      <a class='stretched' href='/post/${p.slug}' aria-label='Read ${p.title || p.slug}'></a>
    </div>`).join('\n');
  const body = `
    <section class='hero'>
      <h1>Posty</h1>
      <p class='lead'>A tiny, modern, playful Markdown microblog. Write fast. Render pretty. No database—just files.</p>
      <div class='actions'>
        <a href='/new'>Create a Post</a>
      </div>
    </section>
    <section>
      <h2>Latest Posts</h2>
      <div class='grid'>${cards || `<p class='empty'>No posts yet. Be the first!</p>`}</div>
    </section>`;
  res.send(renderLayout('Home', body));
});

app.get('/post/:slug', (req, res) => {
  const post = loadPost(req.params.slug);
  if (!post) return res.status(404).send(renderLayout('Not found', `<article><h2>Post not found</h2><p><a href='/'>&larr; Back home</a></p></article>`));
  const html = marked.parse(post.content || '');
  const safe = sanitizeHtml(html, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']) });
  const body = `
    <article class='fade-in'>
      <h2>${post.title || post.slug}</h2>
      ${post.date ? `<p><small>${post.date}</small></p>` : ''}
      <div class='post-body'>${safe}</div>
      <div class='actions' style='margin-top:2rem'>
        <a href='/'>&larr; Back</a>
      </div>
    </article>`;
  res.send(renderLayout(post.title || post.slug, body));
});

app.get('/new', (req, res) => {
  const body = `
    <article class='fade-in'>
      <h2>Create New Post</h2>
      <form method='post' action='/new' autocomplete='off'>
        <label>Title
          <input name='title' required placeholder='An Awesome Idea'>
        </label>
        <label>Date
          <input type='date' name='date' value='${new Date().toISOString().slice(0,10)}'>
        </label>
        <label>Content (Markdown)
          <textarea name='content' required placeholder='# Heading\n\nShare something interesting...'># Hello World\n\nWrite something awesome.</textarea>
        </label>
        <div class='actions'>
          <button type='submit'>Publish</button>
          <a href='/'>Cancel</a>
        </div>
      </form>
    </article>`;
  res.send(renderLayout('New Post', body));
});

app.post('/new', (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content) return res.status(400).send('Missing fields');
  const slug = slugify(title, { lower: true, strict: true }) || `post-${Date.now()}`;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    return res.status(409).send(renderLayout('Conflict', `<p>Slug already exists. Try a different title.</p><p><a href='/new'>Back</a></p>`));
  }
  const frontMatter = matter.stringify(content, { title, date: date || new Date().toISOString().slice(0,10) });
  fs.writeFileSync(filePath, frontMatter, 'utf-8');
  res.redirect(`/post/${slug}`);
});

app.listen(PORT, () => {
  console.log(`Posty listening on http://localhost:${PORT}`);
});
