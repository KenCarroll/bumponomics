<template>
    <v-container>
        <!-- Header & Toolbar -->
        <div class="mb-6">
            <div class="d-flex flex-wrap align-center justify-space-between gap-4 mb-4">
                <div>
                    <h1 class="text-h4 font-weight-bold">Community</h1>
                    <p class="text-medium-emphasis">
                        <span class="font-weight-bold text-primary">{{ filteredPeople.length }}</span> BUMPivores
                        exploring
                    </p>
                </div>

                <div class="d-flex align-center gap-2" style="min-width: 200px;">
                    <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search name..."
                        variant="outlined" density="compact" hide-details single-line
                        class="flex-grow-1"></v-text-field>

                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-sort" v-bind="props" variant="outlined" color="primary"
                                density="comfortable"></v-btn>
                        </template>
                        <v-list density="compact" nav>
                            <v-list-subheader>Sort by</v-list-subheader>
                            <v-list-item @click="sortBy = 'lastLogin'" :active="sortBy === 'lastLogin'" color="primary">
                                <template v-slot:prepend><v-icon>mdi-clock-outline</v-icon></template>
                                <v-list-item-title>Last Login</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="sortBy = 'joinedAt'" :active="sortBy === 'joinedAt'" color="primary">
                                <template v-slot:prepend><v-icon>mdi-calendar-range</v-icon></template>
                                <v-list-item-title>Date Joined</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="sortBy = 'name_asc'" :active="sortBy === 'name_asc'" color="primary">
                                <template v-slot:prepend><v-icon>mdi-sort-alphabetical-ascending</v-icon></template>
                                <v-list-item-title>Name (A-Z)</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="sortBy = 'name_desc'" :active="sortBy === 'name_desc'" color="primary">
                                <template v-slot:prepend><v-icon>mdi-sort-alphabetical-descending</v-icon></template>
                                <v-list-item-title>Name (Z-A)</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn-toggle v-model="viewMode" mandatory density="compact" variant="outlined" color="primary">
                        <v-btn value="grid" icon="mdi-view-grid-outline"></v-btn>
                        <v-btn value="list" icon="mdi-format-list-bulleted"></v-btn>
                    </v-btn-toggle>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center my-10">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- Error -->
        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
            {{ error }}
        </v-alert>

        <!-- Content -->
        <div v-else>
            <div v-if="filteredPeople.length === 0" class="text-center my-10 text-medium-emphasis">
                <v-icon size="64" class="mb-4 opacity-50">mdi-account-search-outline</v-icon>
                <h2>No registered users found</h2>
                <p v-if="searchQuery">Try adjusting your search</p>
            </div>

            <!-- Grid View -->
            <v-row v-if="viewMode === 'grid'">
                <v-col v-for="person in filteredPeople" :key="person.id" cols="12" sm="6" md="4" lg="3">
                    <v-card variant="outlined" class="text-center pa-4 h-100 hover-card">
                        <v-avatar size="80" color="surface-variant" class="mb-3 elevation-2">
                            <v-img v-if="person.photoURL" :src="person.photoURL" alt="Avatar"></v-img>
                            <span v-else class="text-h4 font-weight-bold primary--text">
                                {{ person.displayName?.charAt(0) || '?' }}
                            </span>
                        </v-avatar>

                        <h3 class="text-h6 font-weight-bold text-truncate px-2">
                            {{ person.displayName || 'Anonymous' }}
                        </h3>

                        <div class="d-flex flex-column gap-1 mt-2 text-caption text-medium-emphasis">
                            <div>Joined: {{ formatDate(person.joinedAt) }}</div>
                            <div v-if="person.lastLogin" class="text-xs">
                                Last seen: {{ formatTimeAgo(person.lastLogin) }}
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <!-- List View -->
            <v-list v-else bg-color="transparent" class="pa-0">
                <v-card v-for="person in filteredPeople" :key="person.id" variant="outlined" class="mb-2">
                    <v-list-item class="pa-3">
                        <template v-slot:prepend>
                            <v-avatar size="48" color="surface-variant" class="mr-3">
                                <v-img v-if="person.photoURL" :src="person.photoURL" alt="Avatar"></v-img>
                                <span v-else class="text-h6 font-weight-bold primary--text">
                                    {{ person.displayName?.charAt(0) || '?' }}
                                </span>
                            </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-bold text-body-1">
                            {{ person.displayName || 'Anonymous' }}
                        </v-list-item-title>

                        <v-list-item-subtitle class="d-flex flex-column flex-sm-row gap-2 mt-1">
                            <span class="d-flex align-center">
                                <v-icon size="x-small" start class="mr-1">mdi-calendar-range</v-icon>
                                Joined {{ formatDate(person.joinedAt) }}
                            </span>
                            <span v-if="person.lastLogin" class="d-flex align-center">
                                <v-icon size="x-small" start class="mr-1">mdi-clock-outline</v-icon>
                                Last login {{ formatTimeAgo(person.lastLogin) }}
                            </span>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-card>
            </v-list>
        </div>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const people = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const viewMode = ref('grid');
const sortBy = ref('lastLogin'); // lastLogin, joinedAt, name_asc, name_desc

const filteredPeople = computed(() => {
    let result = people.value;

    // Filter
    if (searchQuery.value.trim()) {
        const lowerQuery = searchQuery.value.toLowerCase();
        result = result.filter(p =>
            (p.displayName || '').toLowerCase().includes(lowerQuery)
        );
    }

    // Sort
    return [...result].sort((a, b) => {
        if (sortBy.value === 'name_asc') {
            return (a.displayName || '').localeCompare(b.displayName || '');
        } else if (sortBy.value === 'name_desc') {
            return (b.displayName || '').localeCompare(a.displayName || '');
        } else if (sortBy.value === 'joinedAt') {
            // Newest joined first
            const dateA = a.joinedAt?.toDate ? a.joinedAt.toDate() : new Date(a.joinedAt || 0);
            const dateB = b.joinedAt?.toDate ? b.joinedAt.toDate() : new Date(b.joinedAt || 0);
            return dateB - dateA;
        } else {
            // lastLogin (default)
            const dateA = a.lastLogin?.toDate ? a.lastLogin.toDate() : new Date(a.lastLogin || 0);
            const dateB = b.lastLogin?.toDate ? b.lastLogin.toDate() : new Date(b.lastLogin || 0);
            return dateB - dateA;
        }
    });
});

const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = dateStr.toDate ? dateStr.toDate() : new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const fetchPeople = async () => {
    try {
        // We might want to limit this eventually
        const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        people.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching people:", e);
        if (e.code === 'permission-denied') {
            error.value = "Unable to load directory. Please ensured you are logged in.";
        } else {
            error.value = "Failed to load community directory.";
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchPeople();
});
</script>

<style scoped>
.gap-1 {
    gap: 4px;
}

.gap-2 {
    gap: 8px;
}

.gap-4 {
    gap: 16px;
}

.hover-card {
    transition: transform 0.2s, background-color 0.2s;
}

.hover-card:hover {
    background-color: rgb(var(--v-theme-surface-variant), 0.1) !important;
}
</style>
