<script setup>
import { ref, computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ReloadPrompt from './components/ReloadPrompt.vue'
const { Layout } = DefaultTheme
const { theme, isDark } = useData()
const route = useRoute()
const isDrawerOpen = ref(false)

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}

function isActive(link) {
  if (!link) return false
  // Normalize VitePress paths for comparison
  const currentPath = route.path.replace(/\.html$/, '').replace(/\/$/, '')
  const linkPath = link.replace(/\.html$/, '').replace(/\/$/, '')
  return currentPath === linkPath
}

function hasActiveChild(items) {
  if (!items) return false
  return items.some(i => isActive(i.link) || hasActiveChild(i.items))
}

function toggleTheme() {
  isDark.value = !isDark.value
  // Force adding/removing dark class to HTML
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <button class="custom-hamburger" @click="toggleDrawer" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
    </template>
    <template #layout-bottom>
      <ReloadPrompt />
    </template>
  </Layout>

  <Teleport to="body">
    <div class="right-drawer-overlay" :class="{ open: isDrawerOpen }" @click="toggleDrawer"></div>
    
    <div class="right-drawer" :class="{ open: isDrawerOpen }">
      <div class="drawer-header">
        <button class="close-btn" @click="toggleDrawer">&times;</button>
      </div>
      
      <div class="drawer-content">
        <a href="/contents" @click="toggleDrawer" class="drawer-standalone-link" :class="{ 'is-active': isActive('/contents') }">Table of Contents</a>
        
        <!-- Render Sidebar Contents -->
        <details v-for="(group, idx) in theme.sidebar" :key="idx" class="drawer-group" :open="hasActiveChild(group.items) || isActive(group.link)">
          <summary v-if="group.text" class="drawer-main-summary" :class="{ 'has-active-child': hasActiveChild(group.items), 'is-active': isActive(group.link) }">
            <template v-if="group.link">
               <a :href="group.link" @click="toggleDrawer" class="group-link-header">{{ group.text }}</a>
            </template>
            <template v-else>
               {{ group.text }}
            </template>
          </summary>
          <ul class="drawer-main-ul">
            <li v-for="item in group.items" :key="item.text || item.link">
              <template v-if="item.items && item.items.length">
                 <details class="nested-details" :open="!item.collapsed || hasActiveChild(item.items) || isActive(item.link)">
                   <summary class="nested-summary" :class="{ 'has-active-child': hasActiveChild(item.items), 'is-active': isActive(item.link) }">
                      <template v-if="item.link">
                         <a :href="item.link" @click="toggleDrawer" class="group-link-header">{{ item.text }}</a>
                      </template>
                      <template v-else>
                         {{ item.text }}
                      </template>
                   </summary>
                   <ul class="nested-ul">
                     <li v-for="subitem in item.items" :key="subitem.link">
                       <a :href="subitem.link" :class="{ 'is-active': isActive(subitem.link) }" @click="toggleDrawer">{{ subitem.text }}</a>
                     </li>
                   </ul>
                 </details>
              </template>
              <a v-else :href="item.link" :class="{ 'is-active': isActive(item.link) }" @click="toggleDrawer">{{ item.text }}</a>
            </li>
          </ul>
        </details>
      </div>
      
      <!-- Bottom Appearance Switcher -->
      <div class="drawer-footer">
        <button class="theme-toggle" @click="toggleTheme">
          <span v-if="isDark">☀️ Light Mode</span>
          <span v-else>🌙 Dark Mode</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Hidden default hamburger, we bring our own! */
:global(.VPNavBarHamburger) {
  display: none !important;
}

/* Hide native desktop menu / appearance to enforce the drawer logic */
:global(.VPNavBarMenu),
:global(.VPNavBarAppearance),
:global(.VPNavBarExtra) {
  display: none !important;
}

/* Push search box to the far right next to hamburger */
:global(.VPNavBarSearch) {
  position: static !important;
  transform: none !important;
  margin-left: auto !important;
}

/* 
  Hide permanent left sidebar on desktop to avoid weird layout collisions 
  since we use a right drawer for everything.
*/
:global(.VPSidebar) {
  display: none !important;
}
:global(.VPContent) {
  padding-left: 0 !important;
}

.custom-hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: var(--vp-c-text-1);
  margin-left: 12px;
  cursor: pointer;
  transition: color 0.2s;
}
.custom-hamburger:hover {
  color: var(--vp-c-brand);
}

.right-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(2px);
}
.right-drawer-overlay.open {
  opacity: 1;
  visibility: visible;
}

.right-drawer {
  position: fixed;
  top: 0;
  right: -320px;
  width: 320px;
  height: 100vh;
  background: var(--vp-c-bg);
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
  transition: right 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 101;
  display: flex;
  flex-direction: column;
}
.right-drawer.open {
  right: 0;
}

.drawer-header {
  height: var(--vp-nav-height);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.close-btn {
  font-size: 28px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.close-btn:hover {
  color: var(--vp-c-brand);
}

.drawer-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.drawer-group {
  margin-bottom: 24px;
}
.drawer-standalone-link {
  font-weight: 700;
  color: var(--vp-c-text-1) !important;
  margin-bottom: 24px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  text-decoration: none !important;
  transition: color 0.2s;
}
.drawer-standalone-link:hover {
  color: var(--vp-c-brand) !important;
}
.drawer-standalone-link.is-active {
  color: var(--vp-c-brand) !important;
  font-weight: 800 !important;
  background-color: var(--vp-c-brand-soft);
  padding: 6px 12px 6px 4px !important;
  margin-left: -4px;
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 0 6px 6px 0;
}

.drawer-main-summary {
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  transition: color 0.2s;
}
.drawer-main-summary::-webkit-details-marker {
  display: none;
}
.drawer-main-summary:hover {
  color: var(--vp-c-brand);
}
.drawer-main-summary::before {
  content: "▶";
  font-size: 10px;
  transition: transform 0.2s;
  color: var(--vp-c-text-3);
}
details[open] > .drawer-main-summary::before {
  transform: rotate(90deg);
}
.drawer-main-ul {
  padding-left: 12px;
  border-left: 2px solid var(--vp-c-divider);
  padding-top: 8px;
  margin-bottom: 16px;
}
.drawer-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.drawer-content li {
  margin-bottom: 8px;
}
.drawer-content a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
  display: block;
  padding: 4px 0;
}
.drawer-content a:hover {
  color: var(--vp-c-brand);
}

.nested-summary {
  color: var(--vp-c-text-2);
  font-size: 15px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}
.nested-summary::-webkit-details-marker {
  display: none;
}
.nested-summary:hover {
  color: var(--vp-c-brand);
}
.nested-summary::before {
  content: "▶";
  font-size: 10px;
  transition: transform 0.2s;
  color: var(--vp-c-text-3);
}
details[open] .nested-summary::before {
  transform: rotate(90deg);
}
.nested-ul {
  padding-left: 16px !important;
  margin-top: 4px !important;
  border-left: 2px solid var(--vp-c-divider);
}

.drawer-footer {
  padding: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.theme-toggle {
  width: 100%;
  padding: 12px;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.theme-toggle:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
}

/* ====================================
   ROUTER ACTIVE HIGHLIGHTING (DRAWER)
   ==================================== */
   
/* Active file link highlight */
.drawer-content a.is-active {
  color: var(--vp-c-brand) !important;
  font-weight: 800 !important;
  background-color: var(--vp-c-brand-soft);
  padding: 6px 12px !important;
  margin-left: -16px;
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 0 6px 6px 0;
}

/* Make parent folders light up slightly to indicate active location */
.drawer-main-summary.has-active-child,
.nested-summary.has-active-child {
  color: var(--vp-c-text-1) !important;
  font-weight: 800 !important;
}
.drawer-main-summary.has-active-child::before,
.nested-summary.has-active-child::before {
  color: var(--vp-c-brand) !important;
}

/* Treat active folders exactly like active files */
.drawer-main-summary.is-active,
.nested-summary.is-active {
  color: var(--vp-c-brand) !important;
  font-weight: 800 !important;
  background-color: var(--vp-c-brand-soft);
  padding: 6px 12px 6px 4px !important;
  margin-left: -4px;
  border-left: 4px solid var(--vp-c-brand);
  border-radius: 0 6px 6px 0;
}

/* Remove default link styling from the router-aware headers so they fit inside flexbox */
.group-link-header {
  color: inherit !important;
  text-decoration: none !important;
  display: block;
  flex: 1;
}
</style>
