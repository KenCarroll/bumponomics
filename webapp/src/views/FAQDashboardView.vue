<template>
    <v-container>
        <div class="d-flex align-center justify-space-between mb-6">
            <h1 class="text-h4 font-weight-bold">FAQ Dashboard</h1>
            <v-btn-toggle v-model="filter" mandatory color="primary" variant="outlined" density="compact">
                <v-btn value="all">All</v-btn>
                <v-btn value="unanswered">Unanswered</v-btn>
                <v-btn value="answered">Answered</v-btn>
            </v-btn-toggle>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center my-10">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Error -->
        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
            {{ error }}
        </v-alert>

        <!-- List -->
        <div v-else>
            <div v-if="filteredFaqs.length === 0" class="text-center my-10 text-medium-emphasis">
                <v-icon size="64" class="mb-4 opacity-50">mdi-clipboard-check-outline</v-icon>
                <h2>No questions found</h2>
                <p>Current filter: {{ filter }}</p>
            </div>

            <v-row v-else>
                <v-col v-for="faq in filteredFaqs" :key="faq.id" cols="12" md="6">
                    <v-card variant="outlined" class="h-100 d-flex flex-column">
                        <v-card-text class="flex-grow-1">
                            <div class="d-flex justify-space-between align-start mb-2">
                                <v-chip size="x-small" :color="faq.answered ? 'success' : 'warning'" variant="flat">
                                    {{ faq.answered ? 'Answered' : 'Pending' }}
                                </v-chip>
                                <div class="text-caption text-disabled text-right">
                                    <div>{{ formatDate(faq.createdAt) }}</div>
                                    <div v-if="faq.pagePath" class="text-truncate" style="max-width: 150px;">
                                        <router-link :to="{ name: 'read', params: { path: faq.pagePath } }"
                                            class="text-decoration-none text-primary">
                                            {{ faq.pagePath.split('/').pop() }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>

                            <div class="text-subtitle-2 mb-1">{{ faq.userDisplayName || 'Anonymous' }} asked:</div>
                            <p class="text-body-1 font-weight-medium mb-4">{{ faq.question }}</p>

                            <v-divider v-if="faq.answer" class="mb-3 border-dashed"></v-divider>

                            <div v-if="faq.answer" class="bg-surface-variant pa-3 rounded">
                                <div class="d-flex align-center mb-1 text-primary">
                                    <v-icon size="small" start>mdi-check-circle</v-icon>
                                    <span class="text-caption font-weight-bold">Answered by {{ faq.answeredBy || 'Admin'
                                        }}</span>
                                </div>
                                <p class="text-body-2">{{ faq.answer }}</p>
                            </div>
                        </v-card-text>

                        <v-card-actions class="pa-4 pt-0 border-t bg-surface">
                            <div class="w-100">
                                <v-expand-transition>
                                    <div v-if="answeringId === faq.id">
                                        <v-textarea v-model="answerText" label="Write answer..." variant="outlined"
                                            rows="3" auto-grow hide-details="auto" class="mb-2 mt-2"
                                            autofocus></v-textarea>
                                        <div class="d-flex justify-end gap-2">
                                            <v-btn variant="text" size="small"
                                                @click="answeringId = null">Cancel</v-btn>
                                            <v-btn color="primary" size="small" @click="submitAnswer(faq.id)"
                                                :loading="submittingAnswer">Post</v-btn>
                                        </div>
                                    </div>
                                    <v-btn v-else-if="!faq.answered || answeringId !== faq.id" variant="tonal"
                                        color="primary" block @click="initAnswer(faq)">
                                        {{ faq.answered ? 'Edit Answer' : 'Answer Question' }}
                                    </v-btn>
                                </v-expand-transition>
                            </div>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFAQ } from '@/composables/useFAQ'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const { faqs, loading, error, fetchFAQs, answerQuestion, stopListening } = useFAQ()

const filter = ref('all') // all, unanswered, answered

const filteredFaqs = computed(() => {
    if (filter.value === 'unanswered') return faqs.value.filter(f => !f.answered)
    if (filter.value === 'answered') return faqs.value.filter(f => f.answered)
    return faqs.value
})

const answeringId = ref(null)
const answerText = ref('')
const submittingAnswer = ref(false)

const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

const initAnswer = (faq) => {
    answeringId.value = faq.id
    answerText.value = faq.answer || ''
}

const submitAnswer = async (faqId) => {
    if (!answerText.value.trim()) return

    submittingAnswer.value = true
    try {
        await answerQuestion(faqId, answerText.value, user.value)
        answeringId.value = null
        answerText.value = ''
    } catch (e) {
        alert(e.message)
    } finally {
        submittingAnswer.value = false
    }
}

onMounted(() => {
    fetchFAQs(null) // Fetch all
})

onUnmounted(() => {
    stopListening()
})
</script>

<style scoped>
.gap-2 {
    gap: 8px;
}
</style>
