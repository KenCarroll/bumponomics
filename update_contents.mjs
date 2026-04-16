import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getSidebar(dir, basePath = '') {
  const items = []
  if (!fs.existsSync(dir)) return items;
  const files = fs.readdirSync(dir)
  files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))

  for (const file of files) {
    const skipList = ['index.md', 'contents.md', 'public', 'images', 'connect.md'];
    if (file.startsWith('.') || skipList.includes(file)) continue;
    
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      const dirMatch = file.match(/^(\d+)-(.+)$/);
      let text = file.replace(/-/g, ' ').toUpperCase();
      if (dirMatch) text = `${dirMatch[1]}: ${dirMatch[2].replace(/-/g, ' ').toUpperCase()}`;
      
      const children = getSidebar(fullPath, `${basePath}/${file}`)
      
      // Keep user's custom formatting logic for headers
      if (file === "02-systems-analysis") text = `1.2 Systems Analysis`
      else if (file === "01-micro-level") text = `1.2.1 Micro Level`
      else if (file === "03-obstruction-analysis") text = `1.3 Obstruction Analysis`
      else if (file === "04-reference-projections") text = `1.4 Reference Projections`
      else if (file === "02-the-ten-megatrends") text = `1.4.2 The Ten Megatrends`
      else if (file === "05-reference-scenario") text = `1.5 Reference Scenario`
      else if (file === "01-key-assumptions") text = `Key Assumptions`
      
      items.push({ text: text, isDir: true, items: children })
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      let title = file.replace('.md', '')
      const h1Match = content.match(/^#\s+(.*)$/m)
      if (h1Match) title = h1Match[1].trim()
      
      items.push({ text: title, link: `${basePath}/${file.replace('.md', '')}` })
    }
  }
  return items
}

function renderMarkdownList(items, depth = 0) {
  let md = '';
  const indent = '  '.repeat(depth)
  for (const item of items) {
    if (item.isDir) {
      if (depth === 0) {
        md += `\n## ${item.text}\n`
      } else {
        md += `${indent}- **${item.text}**\n`
      }
      md += renderMarkdownList(item.items, depth + 1)
    } else {
      md += `${indent}- [${item.text}](${item.link.substring(1)}.md)\n`
    }
  }
  return md
}

const rootDir = path.resolve(__dirname, 'content')
const sidebar = getSidebar(rootDir)
const markdown = `# Table of Contents\n\nThis page dynamically matches the book's core architecture.\n` + renderMarkdownList(sidebar)

fs.writeFileSync(path.join(rootDir, 'contents.md'), markdown)
console.log("Updated contents.md!")
