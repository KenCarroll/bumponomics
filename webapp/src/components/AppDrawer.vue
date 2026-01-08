<template>
  <v-list density="compact" nav>
    <template v-for="item in items" :key="item.path">
      <!-- Folder Group -->
      <v-list-group v-if="item.type === 'directory'" :value="item.path">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="item.name" prepend-icon="mdi-folder-outline"></v-list-item>
        </template>
        
        <!-- Recursion -->
        <app-drawer :items="item.children" class="pl-4" />
      </v-list-group>

      <!-- Markdown File Link -->
      <v-list-item
        v-else-if="item.type === 'file'"
        :title="item.title || item.name"
        :value="item.path"
        :to="{ name: 'read', params: { path: item.path } }"
        prepend-icon="mdi-file-document-outline"
        active-color="primary"
      ></v-list-item>
    </template>
  </v-list>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
/* Minor indent tweaking if needed, though Vuetify handles nesting well */
</style>
