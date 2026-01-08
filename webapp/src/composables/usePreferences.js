import { ref, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './useAuth'

export function usePreferences() {
  const theme = useTheme()
  const { user } = useAuth()
  
  // State
  const isDark = ref(localStorage.getItem('user_theme') !== 'light')

  // Apply theme
  const applyTheme = () => {
    theme.global.name.value = isDark.value ? 'dark' : 'light'
    localStorage.setItem('user_theme', isDark.value ? 'dark' : 'light')
  }

  // Toggle function
  const toggleTheme = async () => {
    isDark.value = !isDark.value
    applyTheme()
    await syncToCloud()
  }

  // Cloud Sync
  const syncToCloud = async () => {
    if (!user.value) return
    const userRef = doc(db, 'users', user.value.uid)
    try {
      await setDoc(userRef, { 
        preferences: { theme: isDark.value ? 'dark' : 'light' } 
      }, { merge: true })
    } catch (e) {
      console.error("Failed to sync preference:", e)
    }
  }

  // Load from Cloud on login
  watch(user, async (newUser) => {
    if (newUser) {
      const userRef = doc(db, 'users', newUser.uid)
      try {
        const snap = await getDoc(userRef)
        if (snap.exists() && snap.data().preferences?.theme) {
          isDark.value = snap.data().preferences.theme === 'dark'
          applyTheme()
        }
      } catch (e) {
        console.error("Failed to load preferences:", e)
      }
    }
  })

  // Init
  onMounted(() => {
    applyTheme()
  })

  return {
    isDark,
    toggleTheme
  }
}
