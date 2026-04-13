# BUMPS Book Media Guide

This document is a quick reference guide for adding images, external videos, and local videos to the VitePress Markdown files in the Bumponomics book.

## 1. Directory Structure

All media should be saved in the **`content/public/`** directory. 

VitePress automatically maps anything inside `content/public/` to the root `/` path during the build. This means you do **not** include "content" or "public" when writing your markdown links!

- Place images in: `content/public/images/`
- Place small videos in: `content/public/videos/`

---

## 2. Adding / Editing Images

**Step 1:** Save your image file (e.g., `diagram.png`, `chart.jpg`, `icon.svg`) inside `content/public/images/`.
**Step 2:** Open your chapter Markdown file and use the standard Markdown syntax. Include a descriptive Alt Text tag so the book remains accessible.

```markdown
![A description of the diagram](/images/diagram.png)
```

**How to Edit:** 
To "edit" an image, simply overwrite the original file in the `content/public/images/` directory with a new image of the exact same name. The book will automatically update everywhere it is used.

---

## 3. Adding Local Videos (Short/Small Files)

If you have a short video demo (e.g., a lightweight `.mp4`), you can bundle it locally just like an image. Because Markdown doesn't have a native video syntax, VitePress allows you to inject raw HTML directly into your `.md` files.

**Step 1:** Save your video in `content/public/videos/`.
**Step 2:** Paste this HTML snippet into your chapter:

```html
<video controls width="100%">
  <source src="/videos/my-feature-demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

---

## 4. Adding Hosted Videos (Firebase/YouTube)

If your video is heavy (e.g., over 10MB), adding it directly to the repository will slow down Git. It is highly recommended to host large videos on **Firebase Storage** or **YouTube** and reference them via absolute URLs.

### Using Firebase Storage
Use the exact same HTML `<video>` tag, but replace the `src` with the absolute Firebase URL:

```html
<video controls width="100%">
  <source src="https://firebasestorage.googleapis.com/v0/b/bumps.../my-demo.mp4" type="video/mp4">
</video>
```

### Using YouTube
Simply grab the standard embed iframe provided by YouTube and paste it directly into your markdown:

```html
<iframe 
  width="100%" 
  height="400" 
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
  frameborder="0" 
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

---

### Pro Tips for Media Management
* **Keep it Clean:** Avoid using raw Base64 strings directly inside the Markdown text. They bloat the repository and crash IDEs. Always convert them to `.png` files!
* **Optimization:** VitePress will automatically optimize and hash local images in `content/public` when you run `npm run build`.

---

## 5. Branding Guidelines (Logo, Trademarks, & Copyright)

When authoring or formatting content for the Bumponomics book, please adhere to these official guidelines:

### The Official Logo
The official BUMPS logo has been added to the repository at `content/public/images/bumps.svg`. 
To use the logo on the front page of a chapter or the book's root index, reference it in your VitePress markdown like this (remembering that VitePress maps the public folder to the root):

```markdown
![BUMPS Logo](/images/bumps.svg)
```

### Trademarks & Intellectual Property
To maintain the integrity and protection of the methodology, ensure the correct trademarks and copyright notices are respected across public-facing documents:
- **Copyright Statement:** `© 2026 Bumpconductor BV. All rights reserved.`
- **Trademarks:** `BUMPONOMICS™` and `BUMPS™` are official trademarks. Always ensure the trademark symbols (™) are present in main headers, titles, or the first major introduction of the terms within a new document. 
- **License:** The core material is protected under the **CC BY-NC-ND 4.0** license to prevent uncredited commercial exploitation or unauthorized derivative variations of the Viable Economic Model.
