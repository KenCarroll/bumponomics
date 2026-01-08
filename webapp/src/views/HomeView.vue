<template>
  <div class="home-container fill-height d-flex flex-column">
    
    <!-- Hero Section -->
    <section class="hero-section d-flex align-center justify-center text-center px-4">
      <div class="hero-content" style="max-width: 900px;">
        <v-img 
          src="/book-cover.png" 
          max-width="900"
          width="100%"
          aspect-ratio="1.7778"
          cover
          class="mx-auto mb-8 elevation-10 rounded"
          alt="Bumponomics Hero"
        ></v-img>
        
        <h1 class="text-h4 text-md-h2 text-lg-h1 font-weight-bold mb-4 text-high-emphasis">
          BUMPONOMICS<sup style="font-size: 0.4em; vertical-align: top; top: 0.5em;">TM</sup>
        </h1>
        <h2 class="text-h6 text-md-h4 font-weight-bold mb-8 text-medium-emphasis">
          People & Problems = Progress
        </h2>
        
        <p class="text-h6 mb-10 text-medium-emphasis" style="line-height: 1.6; max-width: 700px; margin: 0 auto;">
          <!-- An atlas to navigate problems, reveal systems, and ask beautiful questions in a radically shifting world.
          Reject the idea that problems are errors. Embrace them as energy. -->
          Using Human & Artifical Intelligence to survive and thrive in complex dynamic environments.
        </p>

        <v-btn 
          size="x-large" 
          color="primary" 
          elevation="4" 
          rounded="pill" 
          class="px-8 font-weight-bold"
          @click="startReading"
        >
          Start Reading
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </section>

    <!-- The Premise Section (Below Fold) -->
    <section class="premise-section py-16 px-4 bg-surface">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <h3 class="text-h4 font-weight-bold mb-4 text-primary">Problems as Usage</h3>
            <p class="text-body-1 mb-4 text-medium-emphasis">
              Traditional economics treats problems as externalities to be eliminated. 
              <strong>Bumponomics</strong> flips the script. 
            </p>
            <p class="text-body-1 text-medium-emphasis">
              What if the friction you feel—the "BUMP"—is actually the raw fuel for innovation?
              Learn how to map the landscape of problems and navigate the thermodynamics of social friction.
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-center">
            <v-icon size="200" color="primary" class="opacity-20">mdi-chart-bubble</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Reviews / Social Proof -->
    <section class="reviews-section py-16 bg-background border-t">
      <home-reviews />
    </section>

    <!-- Footer -->
    <v-footer class="bg-surface py-8 border-t d-flex flex-column">
      <div class="d-flex flex-wrap justify-center gap-4 mb-4">
        <v-btn variant="text" size="small">Contact Us</v-btn>
        <v-btn variant="text" size="small">About the Author</v-btn>
        <v-btn variant="text" size="small">License</v-btn>
      </div>
      <div class="text-caption text-medium-emphasis text-center">
        &copy; 2026 Bumponomics™. All Rights Reserved.<br>
      </div>
    </v-footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import contentItems from '@/content.json'
import HomeReviews from '@/components/HomeReviews.vue'

const router = useRouter()

// Helper to find the first file path to start reading
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

const startReading = () => {
  const firstPath = findFirstFile(contentItems)
  if (firstPath) {
    router.push({ name: 'read', params: { path: firstPath } })
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 85vh; /* Almost full viewport */
  /* background removed to use theme default */
}

.opacity-20 {
  opacity: 0.2;
}

.gap-4 {
  gap: 16px;
}
</style>
