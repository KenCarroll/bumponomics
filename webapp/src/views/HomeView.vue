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
          How to Organize, Act, and Thrive in a Turbulent World
        </h2>

        <p class="text-h6 mb-10 text-medium-emphasis" style="line-height: 1.6; max-width: 700px; margin: 0 auto;">
          <!-- An atlas to navigate problems, reveal systems, and ask beautiful questions in a radically shifting world.
          Reject the idea that problems are errors. Embrace them as energy. -->
          The playbook for adapting to a world of shocks, shifts, and disruptions.

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
            <h3 class="text-h4 font-weight-bold mb-4 text-primary">Progress is Problem Transforming</h3>
            <div style="max-width: 900px; margin: 0 auto;" class="text-left">
              <p class="text-body-1 mb-4">
                We have entered a new economic reality where "business as usual" is a guaranteed path to failure. We are
                often organized using rigid inflexible structures based on the assumption of stable, predictable
                conditions. But today's world is defined by rapidly changing, complex, and messy problematic
                disruptions.
                If our world is defined by problems shouldn't individuals, organisations, and societies be focused on
                them as key drivers?
              </p>
              <p class="text-body-1 mb-4">
                Yet current economic thinking generally treats problems as <strong>externalities</strong> to be managed.
                Even the most advanced complexity theories describe <strong>how</strong> problems drive evolution, but
                they don't provide a framework for <strong>intentionally organizing</strong> society around the
                transformation of problems.
                There is no explicit "Problem-Based Economics" currently in operation.
                <strong>BUMPONOMICS</strong> is being developed to fill this unique void.
              </p>
              <p class="text-body-1 mb-4">
                <strong>Bumponomics</strong> sets course to form an economic system that is tuned to the realities of
                our environment.
                A <strong>Problem Transforming Economy</strong> with problems being 1st class citizens. An economic
                system that emerges from <strong>Problem Transforming
                  Societies</strong> powered by <strong>Problem Transforming Organizations</strong>—fluid, adaptive
                collectives that organize to address high energy opportunities we call <strong>BUMPS (Big Untransformed
                  Meaningful
                  Problematic Situations)</strong>. Organisations that are able to dissolve and re-organize as problems
                shift and transform, and new problems emerge.
                If done correctly, transformations create the conditions for the emergence of new problems! This is a <strong>recursive fractal process</strong> that repeats at micro, messo, and macro layers.          </p>
              <p class="text-body-1">
                Bumponomics is not just theory. It's a language, a mindset, and a transformation tool. Bumponomics is
                being codified in the <a href="https://www.bumps.app" target="_blank">BUMPS.app</a>.
                The <strong>BUMPS.app</strong> is being built as a Co-Intelligence Engine. It combines Human
                Intelligence (HI) and Artificial Intelligence (AI) to identify, organize, and transform BUMPS from
                obstacles to stepping stones to success.
                <strong>BUMPS.app</strong> network will connect Organizations to form Problem Transforming Networks to
                tackle complex adaptive problems.
              </p>
              <p class="text-h4 mt-6 font-italic text-center">
                If current economic systems can’t transform our problems, let’s build ones that will.
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
              <li class="mb-2"><strong>The Shift</strong>: How to transition from rigid business hierarchies to fluid
                Problem Transforming Organizations.</li>
              <li class="mb-2"><strong>The Mindset</strong>: How to become a Bumpivore—move from task based to problem
                based thinking. Seeking out and consuming
                problems to fuel your development, secure your suvival, and enable you to thrive.</li>
              <li class="mb-2"><strong>The Engine</strong>: How to leverage Human Intelligence (HI) and
                Artificial Intelligence (AI) to identify, organize, and transform BUMPS from obstacles to
                stepping stones to success.</li>
            </ul>
            <p class="text-body-1 mt-0 font-italic">
              <strong>Your</strong> success depends upon <strong>your</strong> ability to transform <strong>your</strong> problems!
            </p>
            <!-- <p class="text-body-1 mb-4">
                <strong>Bumponomics</strong> provides a playbook for how to organize, act, and thrive in complex dynamic
                environments using the synthesis of <strong>Human Intelligence (HI)</strong> supported by
                <strong>Artificial Intelligence (AI)</strong>.
              </p> -->
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
            <p class="text-body-1 mt-4 font-italic">The Future of Work is Problem Transforming!
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Detailed Content Section -->
    <section class="content-section py-12 bg-background border-t"
      v-if="(sponsors.partners && sponsors.partners.length) || (sponsors.patrons && sponsors.patrons.length)">
      <v-container>
        <div class="text-center mb-8">
          <h3 class="text-h4 font-weight-bold text-primary mb-2">Our Community</h3>
          <p class="text-body-1 text-medium-emphasis">Made possible by our Transformation Partners & Patrons</p>
        </div>

        <!-- Partners -->
        <v-row justify="center" class="mb-8" v-if="sponsors.partners && sponsors.partners.length">
          <v-col cols="12" class="d-flex justify-center flex-wrap gap-8">
            <v-card v-for="partner in sponsors.partners" :key="partner.name" :href="partner.url" target="_blank"
              class="pa-6 d-flex align-center justify-center bg-surface-variant" min-width="200" min-height="120" link
              elevation="2">
              <div class="text-center">
                <v-icon :icon="partner.logo || 'mdi-domain'" size="40" class="mb-2 text-medium-emphasis"></v-icon>
                <div class="font-weight-bold text-h6">{{ partner.name }}</div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Patrons -->
        <v-row justify="center" v-if="sponsors.patrons && sponsors.patrons.length">
          <v-col cols="12" class="text-center">
            <div class="d-flex justify-center flex-wrap gap-2">
              <v-chip v-for="patron in sponsors.patrons" :key="patron.name" color="purple" variant="outlined"
                class="font-weight-medium">
                <v-icon start icon="mdi-star" size="small"></v-icon>
                {{ patron.name }}
              </v-chip>
            </div>
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
        <v-btn variant="text" size="small" to="/licence">Licence</v-btn>
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
import sponsors from '@/data/sponsors.json'

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
