<template>
  <v-container class="py-16">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-icon size="48" color="primary" class="mb-4">mdi-email-outline</v-icon>
        
        <h3 class="text-h4 font-weight-bold mb-4">Stay in the Loop</h3>
        <p class="text-body-1 text-medium-emphasis mb-8">
          Join the movement based on <strong>Progress</strong> through <strong>Problem Solving</strong>.
          <br class="d-none d-md-block">
          Get the latest Bumponomics updates, articles, and event invites.
        </p>
        
        <!-- Success State -->
        <v-slide-y-transition>
          <div v-if="success" class="py-8">
            <v-icon color="success" size="64" class="mb-4">mdi-check-circle-outline</v-icon>
            <h4 class="text-h5 font-weight-bold text-success">You're Subscribed!</h4>
            <p class="text-body-1 text-medium-emphasis mt-2">Thanks for joining us.</p>
            <v-btn variant="text" color="primary" class="mt-4" @click="reset">Add another email</v-btn>
          </div>

          <!-- Form State -->
          <v-form v-else @submit.prevent="handleSubmit">
            <div class="d-flex flex-column flex-sm-row gap-4 align-start">
              <v-text-field
                v-model="email"
                label="Email Address"
                placeholder="you@example.com"
                variant="outlined"
                bg-color="surface"
                :error-messages="error"
                :disabled="loading"
                rounded="lg"
                class="flex-grow-1 w-100"
                hide-details="auto"
                type="email"
                required
              ></v-text-field>
              
              <v-btn
                type="submit"
                color="primary"
                size="large"
                height="56"
                rounded="lg"
                :loading="loading"
                class="w-100 w-sm-auto mt-4 mt-sm-0 px-8"
              >
                Subscribe
              </v-btn>
            </div>
            <div class="text-caption text-disabled mt-4">
              We respect your inbox. No spam, ever. Unsubscribe anytime.
            </div>
          </v-form>
        </v-slide-y-transition>
      
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useNewsletter } from '@/composables/useNewsletter'

const email = ref('')
const { subscribe, reset, loading, error, success } = useNewsletter()

const handleSubmit = async () => {
  const result = await subscribe(email.value)
  if (result) {
    email.value = ''
  }
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
</style>
