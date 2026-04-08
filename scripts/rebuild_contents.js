const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');
const outputFile = path.join(contentDir, 'contents.md');

let manifest = [];

function parseFrontmatter(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let title = path.basename(filePath, '.md');
    let order = 0;
    let status = 'draft';

    const match = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (match) {
        const fm = match[1];
        const titleMatch = fm.match(/title:\s*"([^"]+)"/);
        const orderMatch = fm.match(/order:\s*([\d.]+)/);
        const statusMatch = fm.match(/status:\s*(\w+)/);

        if (titleMatch) title = titleMatch[1];
        if (orderMatch) order = parseFloat(orderMatch[1]);
        if (statusMatch) status = statusMatch[1];
    }
    return { title, order, status };
}

function processDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    let sectionData = [];

    for (const item of items) {
        if (item.startsWith('.')) continue;
        if (item === 'node_modules') continue;
        if (item === 'contents.md' || item === 'abookoutline.md') continue;

        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        const relPath = path.join(basePath, item);

        if (stat.isDirectory()) {
            const children = processDirectory(fullPath, relPath);
            if (children.length > 0) {
                // Determine order by checking children or parsing directory name if needed. Let's just use 0 for dirs
                sectionData.push({
                    type: 'directory',
                    name: item,
                    path: relPath,
                    children: children.sort((a,b) => a.order - b.order)
                });
            }
        } else if (item.toLowerCase().endsWith('.md')) {
            const meta = parseFrontmatter(fullPath);
            sectionData.push({
                type: 'file',
                name: item,
                path: relPath,
                title: meta.title,
                order: meta.order,
                status: meta.status
            });
        }
    }
    return sectionData.sort((a,b) => a.order - b.order || a.name.localeCompare(b.name));
}

function renderTree(nodes, depth = 0) {
    let md = '';
    // Use heading level based on depth (max h6)
    const hLevel = Math.min(depth + 2, 6);
    const headingPrefix = '#'.repeat(hLevel);
    
    for (const node of nodes) {
        if (node.type === 'directory') {
            md += `\n${headingPrefix} ${node.name.toUpperCase()}\n\n`;
            md += renderTree(node.children, depth + 1);
        } else {
            const badge = node.status === 'stub' ? ' `[STUB]`' : '';
            const linkPath = node.path.split(path.sep).map(encodeURIComponent).join('/');
            // No space indentation, just a regular bullet
            md += `- [${node.title}](${linkPath})${badge}\n`;
        }
    }
    return md;
}

const tree = processDirectory(contentDir);
let outputMd = `# Master Contents Manifest\n*Auto-generated on ${new Date().toISOString()}*\n\n`;
outputMd += renderTree(tree);

fs.writeFileSync(outputFile, outputMd);
console.log('Rebuilt CONTENTS.md at ' + outputFile);
