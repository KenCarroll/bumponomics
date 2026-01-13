import { ref } from 'vue'

const rightDrawerOpen = ref(false)
const rightTab = ref('chat') // 'chat' or 'comments'

export function useLayout() {
  const toggleRightDrawer = (tab) => {
    if (rightDrawerOpen.value && rightTab.value === tab) {
      // If open and on same tab, close it
      rightDrawerOpen.value = false
    } else {
      // Otherwise open and switch tab
      rightTab.value = tab
      rightDrawerOpen.value = true
    }
  }

  const closeRightDrawer = () => {
    rightDrawerOpen.value = false
  }

  return {
    rightDrawerOpen,
    rightTab,
    toggleRightDrawer,
    closeRightDrawer
  }
}
