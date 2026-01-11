<template>
    <v-container class="py-12">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <h1 class="text-h3 font-weight-bold mb-6 text-primary">Licence</h1>

                <v-card class="pa-6">
                    <h2 class="text-h5 font-weight-bold mb-4">Content Rights & Permissions</h2>
                    <p class="text-body-1 mb-4">
                        The content of "Bumponomics: How to Organize, Act, and Thrive in a Turbulent World" is available
                        as
                        Open Access.
                    </p>

                    <div class="bg-background pa-4 rounded mb-6 border">
                        <div class="d-flex align-center mb-2">
                            <v-icon icon="mdi-creative-commons" size="large" class="mr-2"></v-icon>
                            <strong class="text-h6">CC BY 4.0</strong>
                        </div>
                        <p class="text-body-1 mb-2">
                            This work is licensed under the <a href="http://creativecommons.org/licenses/by/4.0/"
                                target="_blank" class="text-primary">Creative Commons Attribution 4.0 International
                                License</a>.
                        </p>
                        <p class="text-body-1 text-medium-emphasis">
                            You are free to:
                        </p>
                        <ul class="ml-4 mb-2 text-body-1 text-medium-emphasis">
                            <li><strong>Share</strong> — copy and redistribute the material in any medium or format</li>
                            <li><strong>Adapt</strong> — remix, transform, and build upon the material for any purpose,
                                even commercially.</li>
                        </ul>
                        <p class="text-body-2 text-medium-emphasis">
                            Under the following terms: You must give appropriate credit, provide a link to the license,
                            and indicate if changes were made.
                        </p>
                    </div>

                </v-card>

                <div class="mt-8 text-center">
                    <v-btn to="/home" variant="text" color="primary">
                        <v-icon start>mdi-arrow-left</v-icon>
                        Back to Home
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
.font-mono {
    font-family: 'Courier New', Courier, monospace;
}
</style>
