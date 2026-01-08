import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the book content (parent directory of webapp)
const CONTENT_ROOT = path.resolve(__dirname, '../');
const OUTPUT_FILE = path.resolve(__dirname, 'src/content.json');

const IGNORE_DIRS = ['webapp', '.git', 'node_modules', '.gemini', '.agent'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

function scanDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    if (item.name.startsWith('.')) continue; // Ignore hidden files

    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(CONTENT_ROOT, fullPath);

    if (item.isDirectory()) {
      if (IGNORE_DIRS.includes(item.name)) continue;
      
      const children = scanDirectory(fullPath);
      if (children.length > 0) {
        result.push({
          type: 'directory',
          name: item.name,
          path: relativePath,
          children
        });
      }
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Simple extraction of title from first line # if present
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : item.name.replace('.md', '');

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
  
  // Sort: Directories first, then files? Or alphabetical?
  // Let's sort alphabetically for now.
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

console.log('Building content index...');
const tree = scanDirectory(CONTENT_ROOT);

// Create src/content.json
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2));
console.log(`Content index written to ${OUTPUT_FILE}`);
