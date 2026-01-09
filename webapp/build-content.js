import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the book content (parent directory of webapp)
const CONTENT_ROOT = path.resolve(__dirname, '../');
const OUTPUT_JSON = path.resolve(__dirname, 'src/content.json');
const OUTPUT_MD = path.resolve(CONTENT_ROOT, 'CONTENTS.md');

const IGNORE_DIRS = ['webapp', '.git', 'node_modules', '.gemini', '.agent', '.vscode', 'dist', 'public'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

function scanDirectory(dir, depth = 0) {
  let items = [];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e);
    return [];
  }

  const result = [];

  for (const item of items) {
    if (item.name.startsWith('.')) continue; // Ignore hidden files

    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(CONTENT_ROOT, fullPath);

    if (item.isDirectory()) {
      if (IGNORE_DIRS.includes(item.name)) continue;
      
      const children = scanDirectory(fullPath, depth + 1);
      // Only include directories that have children (or are likely intended to be chapters)
      if (children.length > 0) {
        result.push({
          type: 'directory',
          name: item.name,
          path: relativePath,
          children
        });
      }
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // Skip the generated CONTENTS.md to avoid recursion loops or clutter
      if (item.name === 'CONTENTS.md') continue;
      // Skip generic files if needed, but let's keep most
      
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Simple extraction of title from first line # if present
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : item.name.replace('.md', '');

      result.push({
        type: 'file',
        name: item.name,
        title: title,
        path: relativePath,
        // We could include full content here or fetch it lazily. 
        // For a small book, including it in one JSON is fine and fast.
        content: content
      });
    }
  }
  
  // Sort: Directories first, then files. Alphabetical within groups using numeric sort.
  return result.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    }
    return a.type === 'directory' ? -1 : 1;
  });
}

function generateMarkdownTOC(nodes, depth = 0) {
  let markdown = '';
  // Use 2 spaces for indentation
  const indent = '  '.repeat(depth);

  for (const node of nodes) {
    if (node.type === 'directory') {
      // Make directory name bold, remove "Part X - " prefix if you want cleaner look, but for now exact match is safer
      markdown += `${indent}- **${node.name}**\n`;
      markdown += generateMarkdownTOC(node.children, depth + 1);
    } else {
      // Use encodeURI for the path to handle spaces
      // Relative path from root is what we have in node.path
      // The CONTENTS.md is in root, so links should be just the path.
      // e.g. "Part 1/.../file.md"
      const linkPath = node.path.split(path.sep).map(encodeURIComponent).join('/');
      markdown += `${indent}- [${node.title}](${linkPath})\n`;
    }
  }
  return markdown;
}

console.log('Building content index...');
console.log(`Scanning root: ${CONTENT_ROOT}`);
const tree = scanDirectory(CONTENT_ROOT);

// Create src/content.json
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(tree, null, 2));
console.log(`Content index written to ${OUTPUT_JSON}`);

// Create CONTENTS.md
const tocContent = `# Book Contents\n\n*Auto-generated on ${new Date().toLocaleString()}*\n\n` + generateMarkdownTOC(tree);
fs.writeFileSync(OUTPUT_MD, tocContent);
console.log(`Markdown TOC written to ${OUTPUT_MD}`);
