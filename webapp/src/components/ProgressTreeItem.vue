<template>
    <!-- File Item -->
    <v-list-item v-if="node.type === 'file'" active-color="primary" @click="$emit('toggle', node.path)">
        <template v-slot:prepend>
            <v-icon :color="isSelected(node.path) ? 'success' : 'medium-emphasis'" class="mr-4">
                {{ isSelected(node.path) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
            </v-icon>
        </template>
        <v-list-item-title :class="{ 'text-decoration-line-through text-medium-emphasis': isSelected(node.path) }">
            {{ node.name }}
        </v-list-item-title>
    </v-list-item>

    <!-- Directory Group -->
    <v-list-group v-else :value="node.path">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-list-item-title class="font-weight-bold">
                    {{ node.name }}
                </v-list-item-title>
                <template v-slot:append>
                    <div class="d-flex align-center text-caption text-medium-emphasis">
                        <span class="mr-2">{{ progressStats.completed }}/{{ progressStats.total }}</span>
                        <v-progress-circular :model-value="progressStats.percent" color="primary" size="20"
                            width="3"></v-progress-circular>
                    </div>
                </template>
            </v-list-item>
        </template>

        <!-- Recursive Children -->
        <template v-for="child in node.children" :key="child.path">
            <progress-tree-item :node="child" :selected-paths="selectedPaths" @toggle="$emit('toggle', $event)" />
        </template>
    </v-list-group>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    node: {
        type: Object,
        required: true
    },
    selectedPaths: {
        type: Array,
        required: true
    }
})

defineEmits(['toggle'])

const isSelected = (path) => props.selectedPaths.includes(path)

// Helper to count recursively
const countFiles = (n) => {
    if (n.type === 'file') return 1
    if (n.children) return n.children.reduce((acc, child) => acc + countFiles(child), 0)
    return 0
}

const countCompleted = (n) => {
    if (n.type === 'file') return isSelected(n.path) ? 1 : 0
    if (n.children) return n.children.reduce((acc, child) => acc + countCompleted(child), 0)
    return 0
}

const progressStats = computed(() => {
    const total = countFiles(props.node)
    const completed = countCompleted(props.node)
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, percent }
})
</script>
