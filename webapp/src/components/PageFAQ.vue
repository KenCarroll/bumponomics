<template>
    <div class="faq-container fill-height d-flex flex-column">
        <div class="pa-4 border-b bg-surface">
            <div class="d-flex align-center justify-space-between">
                <h3 class="text-h6 font-weight-bold d-flex align-center">
                    <v-icon start color="primary">mdi-forum</v-icon>
                    Page Q&A
                </h3>
                <v-btn icon="mdi-close" variant="text" size="small" @click="emit('close')"></v-btn>
            </div>
            <p class="text-caption text-medium-emphasis">
                Questions & Answers for this section.
            </p>
        </div>

        <!-- Error Alert -->
        <v-alert v-if="error" type="error" variant="tonal" class="ma-2" closable density="compact">
            {{ error }}
        </v-alert>

        <!-- Success Feedback -->
        <v-snackbar v-model="successMessage.show" color="success" timeout="3000" location="top">
            {{ successMessage.text }}
            <template v-slot:actions>
                <v-btn variant="text" @click="successMessage.show = false">Close</v-btn>
            </template>
        </v-snackbar>

        <!-- Questions List -->
        <v-list class="flex-grow-1 overflow-y-auto bg-transparent pa-2" v-if="!loading && faqs.length > 0">
            <v-card v-for="faq in faqs" :key="faq.id" class="mb-4" variant="outlined">
                <v-card-text>
                    <div class="d-flex justify-space-between align-start mb-2">
                        <span class="font-weight-bold text-body-2">{{ faq.userDisplayName || 'Anonymous' }}
                            asked:</span>
                        <span class="text-caption text-disabled">{{ formatDate(faq.createdAt) }}</span>
                    </div>
                    <p class="text-body-1 font-weight-medium mb-3">{{ faq.question }}</p>

                    <v-divider v-if="faq.answer" class="mb-3 border-dashed"></v-divider>

                    <div v-if="faq.answer" class="bg-surface-variant pa-3 rounded">
                        <div class="d-flex align-center mb-1 text-primary">
                            <v-icon size="small" start>mdi-check-circle</v-icon>
                            <span class="text-caption font-weight-bold">Answered by {{ faq.answeredBy || 'Admin'
                                }}</span>
                        </div>
                        <p class="text-body-2">{{ faq.answer }}</p>
                    </div>

                    <!-- Answer Button (For logged in users, ideally scoped to admin) -->
                    <div v-else class="mt-2">
                        <div v-if="answeringId === faq.id">
                            <v-textarea v-model="answerText" label="Write your answer..." variant="outlined" rows="3"
                                auto-grow hide-details="auto" class="mb-2"></v-textarea>
                            <div class="d-flex justify-end gap-2">
                                <v-btn variant="text" size="small" @click="answeringId = null">Cancel</v-btn>
                                <v-btn color="primary" size="small" @click="submitAnswer(faq.id)"
                                    :loading="submittingAnswer">Post Answer</v-btn>
                            </div>
                        </div>
                        <div v-else-if="user" class="d-flex justify-end">
                            <v-btn variant="text" size="small" color="primary"
                                @click="answeringId = faq.id; answerText = ''">
                                Reply
                            </v-btn>
                        </div>
                        <div v-else class="text-caption text-medium-emphasis font-italic">
                            Waiting for answer...
                        </div>
                    </div>

                </v-card-text>
            </v-card>
        </v-list>

        <!-- Empty State -->
        <div v-else-if="!loading && faqs.length === 0"
            class="d-flex flex-column align-center justify-center flex-grow-1 text-center pa-6 text-medium-emphasis">
            <v-icon size="48" class="mb-4 opacity-50">mdi-comment-question-outline</v-icon>
            <p>No questions yet.</p>
            <p class="text-caption">Be the first to ask about this section!</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center align-center flex-grow-1">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Ask Question Form -->
        <div class="pa-4 border-t bg-surface mt-auto">
            <div v-if="user">
                <v-expand-transition>
                    <div v-if="showForm">
                        <v-textarea v-model="newQuestion" label="What's your question?" variant="outlined" rows="3"
                            auto-grow hide-details="auto" class="mb-3" :disabled="submitting"></v-textarea>
                        <div class="d-flex justify-end gap-2">
                            <v-btn variant="text" size="small" @click="showForm = false"
                                :disabled="submitting">Cancel</v-btn>
                            <v-btn color="primary" size="small" @click="submitQuestion"
                                :loading="submitting">Submit</v-btn>
                        </div>
                    </div>
                    <v-btn v-else block color="primary" variant="tonal" @click="showForm = true"
                        prepend-icon="mdi-plus">
                        Ask a Question
                    </v-btn>
                </v-expand-transition>
            </div>
            <div v-else class="text-center">
                <p class="text-caption mb-2">Sign in to ask a question</p>
                <v-btn block variant="outlined" size="small" @click="emit('login-requested')">
                    Sign In
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, reactive } from 'vue'
import { useFAQ } from '@/composables/useFAQ'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
    pagePath: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['login-requested', 'close'])

const { user } = useAuth()
const { faqs, loading, error, fetchFAQs, addQuestion, answerQuestion, stopListening } = useFAQ()

const showForm = ref(false)
const newQuestion = ref('')
const submitting = ref(false)

const answeringId = ref(null)
const answerText = ref('')
const submittingAnswer = ref(false)

const successMessage = reactive({
    show: false,
    text: ''
})

// Function to format timestamp
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    // Firestore timestamp to Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

const loadData = () => {
    if (props.pagePath) {
        fetchFAQs(props.pagePath)
    }
}

const submitQuestion = async () => {
    if (!newQuestion.value.trim()) return

    // Debug log
    console.log("Submitting question:", {
        path: props.pagePath,
        question: newQuestion.value,
        user: user.value?.uid
    })

    submitting.value = true
    try {
        if (!user.value) throw new Error("You must be logged in to post.")

        await addQuestion(props.pagePath, newQuestion.value, user.value)
        newQuestion.value = ''
        showForm.value = false

        successMessage.text = "Question submitted successfully!"
        successMessage.show = true
    } catch (e) {
        console.error("Submission failed:", e)
        alert(`Failed to submit question: ${e.message}`)
    } finally {
        submitting.value = false
    }
}

const submitAnswer = async (faqId) => {
    if (!answerText.value.trim()) return

    submittingAnswer.value = true
    try {
        await answerQuestion(faqId, answerText.value, user.value)
        answeringId.value = null
        answerText.value = ''
        successMessage.text = "Answer posted successfully!"
        successMessage.show = true
    } catch (e) {
        console.error("Answer failed:", e)
        alert(`Failed to post answer: ${e.message}`)
    } finally {
        submittingAnswer.value = false
    }
}

watch(() => props.pagePath, () => {
    loadData()
    showForm.value = false
    newQuestion.value = ''
})

onMounted(() => {
    loadData()
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
