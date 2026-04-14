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
      const children = getSidebar(fullPath, `${basePath}/${file}`)
      
      if (file === "02-key-assumptions") {
         text = `1.2 Key Assumptions (${children.length - 1})`
      } else if (file === "05-the-ten-megatrends") {
         text = `1.5 Ten Megatrends (${children.length - 1})`
      } else if (file === "01-idealized-design") {
         text = `2.1 Idealized Design (${children.length - 1})`
      } else if (file === "02-mission-statement") {
         text = `2.2 Mission Statement (${children.length - 1})`
      } else if (file === "03-specification") {
         text = `2.3 Specification (${children.length - 1})`
      } else if (file === "04-design-of-organisation") {
         text = `2.4 Design of Organisation (${children.length - 1})`
      }

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
  title: "BUMPONOMICS™",
  description: "The Playbook for Turbulent Worlds",
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/bumps-logo.svg', type: 'image/svg+xml' }]
  ],
  markdown: {
    math: true
  },
  themeConfig: {
    sidebarMenuLabel: 'Chapters',
    logo: '/bumps-logo.svg',
    outline: 'deep',
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: 'Previous Concept',
      next: 'Next Concept'
    },
    footer: {
      message: 'This work is licensed under a CC BY-NC-ND 4.0 International License.',
      copyright: '© 2026 Bumpconductor BV. BUMPONOMICS™ and BUMPS™ are official trademarks. Created by Ken Carroll.'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Table of Contents', link: '/contents' },
      { text: 'Connect', link: '/connect' }
    ],
    sidebar: getSidebar(path.resolve(__dirname, '../'))
  }
})
