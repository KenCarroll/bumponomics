<template>
  <div class="home-container fill-height d-flex flex-column">

    <!-- Hero Section -->
    <section class="hero-section d-flex align-center justify-center text-center px-4 py-4">
      <div class="hero-content" style="max-width: 900px;">
        <v-img src="/people-swarms-v2.png" max-width="900" width="100%" aspect-ratio="1.7778" cover
          class="mx-auto mb-8 elevation-10 rounded" alt="Bumponomics Hero"></v-img>

        <h1 class="text-h3 text-md-h2 text-lg-h1 font-weight-bold mb-4 text-high-emphasis">
          BUMPONOMICS<sup style="font-size: 0.2em; vertical-align: top; top: 0.5em;">TM</sup>
        </h1>
        <h2 class="text-h6 text-md-h4 font-weight-bold mb-8 text-medium-emphasis">
          <!-- People & Problems = Progress -->
          How to Organize, Act, and Thrive in a Bumpy World
        </h2>

        <p class="text-h6 mb-10 text-medium-emphasis" style="line-height: 1.6; max-width: 700px; margin: 0 auto;">
          <!-- An atlas to navigate problems, reveal systems, and ask beautiful questions in a radically shifting world.
          Reject the idea that problems are errors. Embrace them as energy. -->
          We live in a world of economic shocks, rapid technological shifts, and unpredictable disruptions.
          If you want to survive, and thrive, you need to be able to perform in this new reality.

        </p>

        <v-btn size="x-large" color="primary" elevation="4" rounded="pill" class="px-8 font-weight-bold"
          @click="startReading">
          Start Reading
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </section>

    <!-- The Premise Section (Below Fold) -->
    <section class="premise-section py-4 px-4 bg-surface">
      <v-container>
        <v-row align="center">
          <v-col cols="12" class="text-center">
            <h3 class="text-h4 font-weight-bold mb-4 text-primary">Problem Transforming Economics</h3>
            <div style="max-width: 900px; margin: 0 auto;" class="text-left">
              <p class="text-body-1 mb-4">
                We have entered a new economic reality where "business as usual" is a guaranteed path to failure. We are
                often organized using rigid inflexible structures based on the assumption of stable, predictable
                conditions. But today's world is defined by rapidly changing, complex, and messy disruptions.
              </p>
              <p class="text-body-1 mb-4">
                <strong>BUMPONOMICS</strong> is being developed to address this new situation.
                Based on the premise that People and Problems are the drivers of Progress (People & Problems =
                Progress),
                it advocates for a shift towards a more problem-based economy, with problems being 1st class citizens in
                our economic systems.
              </p>
              <p class="text-body-1 mb-4">
                <strong>Problem Transforming Economies</strong> will be the foundation for <strong>Problem Transforming
                  Societies</strong> powered by <strong>Problem Transforming Organizations</strong>—fluid, adaptive
                collectives that organize explicitly around emerging <strong>BUMPS (Big Untransformed Meaningful
                  Problematic Situations)</strong>. And re-organize as those problems shift and new problems emerge.
              </p>
              <p class="text-body-1 mb-4">
                <strong>Bumponomics</strong> provides a playbook for how to organize, act, and thrive in complex dynamic
                environments using the synthesis of <strong>Human Intelligence (HI)</strong> supported by
                <strong>Artificial Intelligence (AI)</strong>.
              </p>
              <p class="text-body-1">
                To test this theory we are building a new digital platform for developing Problem Transforming
                Organizations using the BUMPS Transformation Model. This platform is emerging at
                <strong>www.bumps.app</strong>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Detailed Content Section -->
    <section class="content-section py-4 bg-background border-t">
      <v-container>
        <v-row>
          <!-- Inside Bumponomics -->
          <v-col cols="12" md="6">
            <h3 class="text-h4 font-weight-bold mb-4 text-primary">What's in it for you?</h3>
            <p class="text-body-1 mb-2">In this book, you will learn:</p>
            <ul class="pa-4 text-body-1">
              <li class="mb-2"><strong>The Shift</strong>: How to transition from a rigid business hierarchy to a fluid
                Problem Transforming Organization.</li>
              <li class="mb-2"><strong>The Mindset</strong>: How to become a Bumpivore—seeking out and consuming
                problems to fuel growth.</li>
              <li class="mb-2"><strong>The Engine</strong>: How to leverage the synthesis of Human Intelligence (HI) and
                Artificial Intelligence (AI) to identify, organize around, and transform problems faster than ever
                before.</li>
            </ul>
            <p class="text-body-1 mt-4 font-italic">
              You can't avoid BUMPS. But you can transform them!
            </p>
          </v-col>

          <!-- Who's it for? -->
          <v-col cols="12" md="6">
            <h3 class="text-h4 font-weight-bold mb-4 text-primary">Who's it for?</h3>
            <p class="text-body-1 mb-2">Bumponomics is for the curious and forward-thinking:</p>
            <ul class="pa-4 text-body-1">
              <li class="mb-2"><strong>Leaders & Executives</strong>: Realizing that 5-year strategic plans are useless
                in a nonlinear world. They need a new language to explain "fluidity" to their boards.</li>
              <li class="mb-2"><strong>Entrepreneurs</strong>: A new generation of founders less interested in building
                static empires and more interested in tackling high-value problems.</li>
              <li class="mb-2"><strong>Policy Makers & Economists</strong>: Looking for meaningful progress metrics
                beyond GDP.</li>
              <li class="mb-2"><strong>Students & Educators</strong>: Seeking a new way to think about progress and
                growth.</li>
              <li class="mb-2"><strong>Future Thinkers</strong>: Anyone interested in the future of work and the
                problem-transforming economy.</li>
            </ul>
            <p class="text-body-1 mt-4 font-italic">
              Join the movement! The Future of Work and the Economy is Problem Transforming!
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Reviews / Social Proof -->
    <section class="reviews-section py-4 bg-surface border-t">
      <home-reviews />
    </section>

    <!-- Newsletter Section -->
    <section class="reviews-section py-4 bg-surface border-t">
      <home-newsletter />
    </section>

    <!-- Footer -->
    <v-footer class="bg-surface py-4 border-t d-flex flex-column">
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
import HomeNewsletter from '@/components/HomeNewsletter.vue'

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
  min-height: 85vh;
  /* Almost full viewport */
  /* background removed to use theme default */
}

.opacity-20 {
  opacity: 0.2;
}

.gap-4 {
  gap: 16px;
}
</style>
