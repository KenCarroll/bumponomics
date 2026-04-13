<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
const { theme, isDark } = useData()
const isDrawerOpen = ref(false)

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
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
  </Layout>

  <Teleport to="body">
    <div class="right-drawer-overlay" :class="{ open: isDrawerOpen }" @click="toggleDrawer"></div>
    
    <div class="right-drawer" :class="{ open: isDrawerOpen }">
      <div class="drawer-header">
        <button class="close-btn" @click="toggleDrawer">&times;</button>
      </div>
      
      <div class="drawer-content">
        <!-- Render Sidebar Contents -->
        <div v-for="(group, idx) in theme.sidebar" :key="idx" class="drawer-group">
          <h3 v-if="group.text" class="group-title">{{ group.text }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item.link">
              <a :href="item.link" @click="toggleDrawer">{{ item.text }}</a>
            </li>
          </ul>
        </div>
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
.group-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
</style>
