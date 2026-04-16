import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
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
    // Skip static assets and raw manifests to ensure a clean structural menu
    const skipList = [
      'index.md', 'contents.md', 'public', 'images', 'connect.md'
    ];
    if (file.startsWith('.') || skipList.includes(file)) continue;
    
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    // Crucial: Skip the 00- summary files here so they don't appear as duplicate children!
    if (!stat.isDirectory() && file.startsWith('00-')) continue;

    if (stat.isDirectory()) {
      let text = file.replace(/-/g, ' ').toUpperCase();
      const dirMatch = file.match(/^(\d+)-(.+)$/);
      if (dirMatch) {
         text = `${dirMatch[1]}: ${dirMatch[2].replace(/-/g, ' ').toUpperCase()}`;
      }

      // Automatically search for a '00-xx-summary' file. If found, pull the parent folder title directly from its H1 heading!
      const dirFiles = fs.readdirSync(fullPath);
      const summaryFile = dirFiles.find(f => f.startsWith('00-') && f.endsWith('.md'));
      let linkUrl = undefined;
      
      if (summaryFile) {
         const summaryContent = fs.readFileSync(path.join(fullPath, summaryFile), 'utf8');
         const h1Match = summaryContent.match(/^#\s+(.*)$/m);
         if (h1Match) text = h1Match[1].trim();
         linkUrl = `${basePath}/${file}/${summaryFile.replace('.md', '')}`;
      }

      const children = getSidebar(fullPath, `${basePath}/${file}`)

      items.push({
        text: text,
        link: linkUrl,
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

export default withPwa(defineConfig({
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
    lastUpdated: {
      text: 'Last Updated',
      formatOptions: {
        dateStyle: 'long',
        timeStyle: 'short'
      }
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
  },
  pwa: {
    outDir: '.vitepress/dist',
    registerType: 'autoUpdate',
    includeAssets: ['bumps-logo.svg'],
    manifest: {
      name: 'BUMPONOMICS™',
      short_name: 'Bumponomics',
      description: 'The Economics of Progress',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: 'bumps-logo.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}']
    }
  }
}))
