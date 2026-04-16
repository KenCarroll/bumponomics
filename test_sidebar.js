import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getSidebar(dir, basePath = '') {
  const items = []
  const files = fs.readdirSync(dir)
  
  files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))

  for (const file of files) {
    const skipList = [
      'index.md', 'contents.md', 'public', 'images', 'connect.md'
    ];
    if (file.startsWith('.') || skipList.includes(file)) continue;
    
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      let text = file.replace(/-/g, ' ').toUpperCase();
      const dirMatch = file.match(/^(\d+)-(.+)$/);
      if (dirMatch) {
         text = `${dirMatch[1]}: ${dirMatch[2].replace(/-/g, ' ').toUpperCase()}`;
      }

      const dirFiles = fs.readdirSync(fullPath);
      const summaryFile = dirFiles.find(f => f.startsWith('00-') && f.endsWith('.md'));
      
      if (summaryFile) {
         const summaryContent = fs.readFileSync(path.join(fullPath, summaryFile), 'utf8');
         const h1Match = summaryContent.match(/^#\s+(.*)$/m);
         if (h1Match) text = h1Match[1].trim();
      }

      const children = getSidebar(fullPath, `${basePath}/${file}`)

      items.push({
        text: text,
        collapsed: false,
        items: children
      })
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      let title = file.replace('.md', '')
      let isStub = false
      
      const h1Match = content.match(/^#\s+(.*)$/m)
      if (h1Match) {
         title = h1Match[1].trim()
      } else {
         const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/)
         if (titleMatch) title = titleMatch[1]
      }
      
      if (file.startsWith('00-')) {
         title = 'Overview'
      }
        
      const statusMatch = content.match(/status:\s*([^\n]+)/)
      if (statusMatch && statusMatch[1].trim() === 'stub') {
         isStub = true
      }
        
      items.push({
        text: title + (isStub ? ' 🚧' : ''),
        link: `${basePath}/${file.replace('.md', '')}`
      })
    }
  }
  return items
}

const sidebar = getSidebar(path.resolve(__dirname, './content'))
fs.writeFileSync('sidebar_dump.json', JSON.stringify(sidebar, null, 2))
console.log('Sidebar dumped to sidebar_dump.json')
