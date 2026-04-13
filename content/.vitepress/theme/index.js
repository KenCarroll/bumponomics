import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import YouTube from './components/YouTube.vue'
import BumpsImage from './components/BumpsImage.vue'
import BumpsVideo from './components/BumpsVideo.vue'
import BumpsAudio from './components/BumpsAudio.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('YouTube', YouTube)
    app.component('BumpsImage', BumpsImage)
    app.component('BumpsVideo', BumpsVideo)
    app.component('BumpsAudio', BumpsAudio)
  }
}
