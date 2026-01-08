import { ref } from 'vue'

const ICON_MAP = {
  'Part 1 - The Premise': 'mdi-lightbulb-on-outline',
  'Part 2 - The BUMPS Taxonomy': 'mdi-shape-outline',
  'Part 3 - Game Theory': 'mdi-chess-knight',
  'Chapter 01 - Introduction': 'mdi-book-open-page-variant',
  'Chapter 02 - The Problems with Problems': 'mdi-alert-octagon-outline',
  'Chapter 03 - The BUMPS Philosophy': 'mdi-compass-outline',
}

export function useIcons() {
  const getIcon = (item) => {
    // Handle null item safely
    if (!item) return 'mdi-file-document-outline'
    
    // Check exact name match first (for folders or specific files)
    if (item.name && ICON_MAP[item.name]) return ICON_MAP[item.name]
    if (item.title && ICON_MAP[item.title]) return ICON_MAP[item.title]
    
    // Check if we passed a string name directly
    if (typeof item === 'string' && ICON_MAP[item]) return ICON_MAP[item]

    // Default icons based on type if available
    if (item.type === 'directory') return 'mdi-folder-outline'
    if (item.type === 'file') return 'mdi-file-document-outline'
    
    // Fallback
    return 'mdi-file-document-outline'
  }

  return {
    getIcon,
    ICON_MAP
  }
}
