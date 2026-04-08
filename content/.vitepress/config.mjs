import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Recursive function to build the sidebar reading from the file system
function getSidebar(dir, basePath = '') {
  const items = []
  const files = fs.readdirSync(dir)
  
  // Custom sort to handle numbering (e.g. 01 before 02)
  files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))

  for (const file of files) {
    // Skip hidden files, the root index, and the raw contents manifest
    if (file.startsWith('.') || file === 'index.md' || file === 'contents.md') continue;
    
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      let text = file.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase()
      items.push({
        text: text,
        collapsed: false,
        items: getSidebar(fullPath, `${basePath}/${file}`)
      })
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      let title = file.replace('.md', '')
      let isStub = false
      
      const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/)
      if (titleMatch) title = titleMatch[1]
        
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

export default defineConfig({
  title: "Bumponomics",
  description: "The Playbook for Turbulent Worlds",
  themeConfig: {
    outline: 'deep',
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: 'Previous Concept',
      next: 'Next Concept'
    },
    sidebar: getSidebar(path.resolve(__dirname, '../')),
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Manifest', link: '/contents' }
    ]
  }
})
