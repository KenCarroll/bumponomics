<template>
    <v-container class="py-10" max-width="900">
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <h1 class="text-h4 font-weight-bold text-primary">Your Progress</h1>
                <p class="text-body-2 text-medium-emphasis mt-2">
                    Track your reading journey. Check off sections as you complete them.
                </p>
            </div>
            <v-btn color="primary" rounded="lg" :loading="loading" :disabled="!hasChanges"
                prepend-icon="mdi-content-save" @click="saveChanges">
                Save Changes
            </v-btn>
        </div>

        <v-card border flat rounded="lg">
            <v-progress-linear v-if="loading" indeterminate color="primary" absolute top></v-progress-linear>

            <!-- Stats Header -->
            <v-card-text class="bg-surface-light d-flex align-center py-4 px-6">
                <div class="flex-grow-1">
                    <div class="d-flex justify-space-between text-subtitle-2 font-weight-bold mb-1">
                        <span>{{ selectedCount }} of {{ totalFilesCount }} Completed</span>
                        <span>{{ percentComplete }}%</span>
                    </div>
                    <v-progress-linear :model-value="percentComplete" color="success" height="8"
                        rounded></v-progress-linear>
                </div>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Content Tree -->
            <v-list density="compact" class="py-0">
                <template v-for="item in filteredTree" :key="item.path">
                    <progress-tree-item :node="item" :selected-paths="localCompletedPaths" @toggle="toggleSelection" />
                    <v-divider></v-divider>
                </template>
            </v-list>
        </v-card>

        <v-snackbar v-model="showSnackbar" color="success">
            Progress saved successfully!
            <template v-slot:actions>
                <v-btn variant="text" @click="showSnackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import contentTree from '@/content.json'
import { useProgress } from '@/composables/useProgress'
import ProgressTreeItem from '@/components/ProgressTreeItem.vue'

const { completedPaths, updateAllProgress, loading } = useProgress()

// Local state
const localCompletedPaths = ref([])
const showSnackbar = ref(false)

// Initialize local state
watch(completedPaths, (newVal) => {
    localCompletedPaths.value = [...newVal]
}, { immediate: true })

// Helper to calculate totals for top-level stats
const countTotalFiles = (nodes) => {
    if (!Array.isArray(nodes)) return 0
    return nodes.reduce((acc, node) => {
        if (node.type === 'file') return acc + 1
        if (node.children) return acc + countTotalFiles(node.children)
        return acc
    }, 0)
}

// Filter high level structure if needed, but showing full tree is better.
// Actually we might want to filter out 'Supporting-Docs' if it's there.
// content.json is usually clean but let's just use it directly.
const filteredTree = Array.isArray(contentTree) ? contentTree : []

const totalFilesCount = countTotalFiles(filteredTree)
const selectedCount = computed(() => localCompletedPaths.value.length)
const percentComplete = computed(() => {
    return totalFilesCount === 0 ? 0 : Math.round((selectedCount.value / totalFilesCount) * 100)
})

const hasChanges = computed(() => {
    if (localCompletedPaths.value.length !== completedPaths.value.length) return true
    return !localCompletedPaths.value.every(p => completedPaths.value.includes(p))
})

const toggleSelection = (path) => {
    if (localCompletedPaths.value.includes(path)) {
        localCompletedPaths.value = localCompletedPaths.value.filter(p => p !== path)
    } else {
        localCompletedPaths.value.push(path)
    }
}

const saveChanges = async () => {
    await updateAllProgress(localCompletedPaths.value)
    showSnackbar.value = true
}
</script>
