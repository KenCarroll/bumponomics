import { createRouter, createWebHistory } from 'vue-router'
import ReaderView from '../views/ReaderView.vue'
import contentTree from '@/content.json'

// Helper to find the first file path to redirect root to
const findFirstFile = (nodes) => {
  for (const node of nodes) {
    if (node.type === 'file') return node.path
    if (node.children) {
      const found = findFirstFile(node.children)
      if (found) return found
    }
  }
  return null
}

const firstPath = findFirstFile(contentTree)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/read/:path(.*)', // Catch-all for paths with slashes
      name: 'read',
      component: ReaderView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('../views/ProgressView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

export default router
