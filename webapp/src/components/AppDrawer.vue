<template>
  <v-list density="compact" nav>
    <v-list-item v-if="isRoot" title="Home" value="home" to="/home" prepend-icon="mdi-home-outline"
      active-color="primary"></v-list-item>

    <v-list-item v-if="isRoot" title="Contents" value="contents" :to="{ name: 'read', params: { path: 'CONTENTS.md' } }"
      prepend-icon="mdi-format-list-bulleted" active-color="primary"></v-list-item>

    <template v-for="item in items" :key="item.path">
      <template v-if="item.name !== 'CONTENTS.md'">
        <!-- Folder Group -->
        <v-list-group v-if="item.type === 'directory'" :value="item.path">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="item.name" :prepend-icon="getIcon(item)"></v-list-item>
          </template>

          <!-- Recursion -->
          <app-drawer :items="item.children" class="pl-4" />
        </v-list-group>

        <!-- Markdown File Link -->
        <v-list-item v-else-if="item.type === 'file'" :title="item.title || item.name" :value="item.path"
          :to="{ name: 'read', params: { path: item.path } }" :prepend-icon="getIcon(item)"
          active-color="primary"></v-list-item>
      </template>
    </template>
  </v-list>
</template>

<script setup>
import { useIcons } from '@/composables/useIcons'

defineProps({
  items: {
    type: Array,
    required: true
  },
  isRoot: {
    type: Boolean,
    default: false
  }
})

const { getIcon } = useIcons()
</script>

<style scoped>
:deep(.v-list-item-title) {
  white-space: normal !important;
  line-height: 1.25 !important;
  text-overflow: clip !important;
  overflow: visible !important;
}

:deep(.v-list-item--nav) {
  /* Allow item to grow vertically */
  min-height: 40px !important;
  height: auto !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
</style>
