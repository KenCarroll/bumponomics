import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the book content (parent directory of webapp)
const CONTENT_ROOT = path.resolve(__dirname, '../');
const OUTPUT_JSON = path.resolve(__dirname, 'src/content.json');
const OUTPUT_MD = path.resolve(CONTENT_ROOT, 'CONTENTS.md');

const IGNORE_DIRS = ['webapp', '.git', 'node_modules', '.gemini', '.agent', '.vscode', 'dist', 'public', 'workflows', 'Supporting-Docs'];
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
      // Ignore specific source/system files from the book content
      if (['ABookOutline.md', 'README.md'].includes(item.name) || item.name.startsWith('All Systems Are Problem')) {
         continue;
      }

      // We want CONTENTS.md to be available in the JSON so ReaderView can read it.
      // But we might filter it out of the drawer list in the UI.
      // if (item.name === 'CONTENTS.md') continue;
      
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Simple extraction of title from first line # if present
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : item.name.replace('.md', '');

      result.push({
        type: 'file',
        name: item.name.replace('.md', ''), // Clean name for UI
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
  
  // Sort nodes so files come after directories or mixed? 
  // The scanDirectory function already sorts.
  
  for (const node of nodes) {
    if (node.type === 'directory') {
      if (depth === 0) {
        // Top Level (Part) -> H2 with separator
        markdown += `\n## ${node.name}\n---\n\n`;
      } else if (depth === 1) {
        // Second Level (Chapter) -> H3
        markdown += `\n### ${node.name}\n\n`;
      } else {
        // Deeper -> Bold text
        markdown += `${'  '.repeat(depth - 1)}- **${node.name}**\n`;
      }
      
      markdown += generateMarkdownTOC(node.children, depth + 1);
    } else {
      // File -> List item
      // Skip self-reference in the Markdown (but keep in JSON for routing)
      if (node.name === 'CONTENTS.md') continue;

      const linkPath = node.path.split(path.sep).map(encodeURIComponent).join('/');
      // Indent based on depth, but if we are inside a Chapter (H3), we want list items to be relatively flat?
      // Standard markdown: headers break lists. So simple list items under headers work well.
      // If we are deep, we need indentation?
      // Actually, if we use headers for parents, we don't need deep indentation for children of those parents.
      // But if depth > 2 (sub-folders), we started using lists.
      
      const indent = depth > 1 ? '  '.repeat(depth - 1) : '- '; 
      // If depth 0 or 1 (under H2 or H3), just use bullet
      // But wait, if depth 2 (under H3), standard list '-' is fine.
      
      markdown += `- [${node.title}](${linkPath})\n`;
    }
  }
  return markdown;
}

console.log('Building content index...');
console.log(`Scanning root: ${CONTENT_ROOT}`);
const tree = scanDirectory(CONTENT_ROOT);

// Create CONTENTS.md content first
// Remove the H1 "# Book Contents" because ReaderView adds its own header based on title.
const tocContent = `*Auto-generated on ${new Date().toLocaleString()}*\n\n` + generateMarkdownTOC(tree);

// Update the node in the tree so the JSON has the fresh content
const contentsNode = tree.find(node => node.name === 'CONTENTS.md');
if (contentsNode) {
  contentsNode.content = tocContent;
  contentsNode.title = 'Contents'; // Explicitly set title to match ICON_MAP and "Contents"
}

// Create src/content.json
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(tree, null, 2));
console.log(`Content index written to ${OUTPUT_JSON}`);

// Write CONTENTS.md to disk
// We can add the H1 back for the file on disk if we want it to look good in a text editor, 
// OR we can keep it consistent. Let's keep it consistent so what you see is what you get.
// Actually, if I open it in Obsidian, I might want the header. 
// But the user said "lose the other one". 
// Let's stick to the generated content being 1:1.
fs.writeFileSync(OUTPUT_MD, tocContent);
console.log(`Markdown TOC written to ${OUTPUT_MD}`);
