<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="text-center mb-8">
                <h1 class="text-h3 font-weight-bold text-primary mb-4">Support the Mission</h1>
                <p class="text-h6 text-medium-emphasis" style="max-width: 800px; margin: 0 auto;">
                    BUMPONOMICS is a community-driven initiative. Your support helps us create tools, write content, and
                    build the platform to transform the world's problems.
                </p>
            </v-col>
        </v-row>

        <!-- Donation Section -->
        <v-row class="mb-12">
            <v-col cols="12">
                <v-card class="bg-surface-variant text-center pa-8 rounded-xl elevation-0">
                    <v-icon icon="mdi-coffee" size="64" color="orange" class="mb-4"></v-icon>
                    <h2 class="text-h4 font-weight-bold mb-6">Buy Us a Coffee</h2>
                    <p class="text-body-1 mb-6">
                        Make a one-time contribution to keep the caffeine flowing and the servers running.
                    </p>
                    <div class="d-flex justify-center flex-wrap gap-4">
                        <v-btn v-for="amount in [5, 10, 25, 50]" :key="amount" color="orange" variant="flat"
                            size="large" class="ma-2" prepend-icon="mdi-currency-usd" href="https://stripe.com"
                            target="_blank">
                            {{ amount }}
                        </v-btn>
                        <v-btn variant="outlined" size="large" class="ma-2" href="https://stripe.com" target="_blank">
                            Custom Amount
                        </v-btn>
                    </div>
                    <div class="text-caption text-medium-emphasis mt-4">
                        (Links are placeholders. Please configure valid Stripe Payment Links.)
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Sponsorship Section -->
        <v-row>
            <v-col cols="12" class="text-center mb-6">
                <h2 class="text-h4 font-weight-bold">Become an Official Sponsor</h2>
                <p class="text-body-1 text-medium-emphasis">Join the inner circle of problem solvers.</p>
            </v-col>

            <v-col v-for="tier in sponsorshipTiers" :key="tier.name" cols="12" md="4">
                <v-card class="h-100 d-flex flex-column pa-6" :class="tier.highlight ? 'border-primary' : ''"
                    :variant="tier.highlight ? 'outlined' : 'elevated'">
                    <div class="text-center mb-4">
                        <v-icon :icon="tier.icon" size="48" :color="tier.color" class="mb-2"></v-icon>
                        <h3 class="text-h5 font-weight-bold">{{ tier.name }}</h3>
                        <div class="text-h4 font-weight-bold text-primary my-2">{{ tier.price }}<span
                                class="text-body-2 text-medium-emphasis">/mo</span></div>
                    </div>

                    <v-divider class="mb-4"></v-divider>

                    <v-list density="compact" class="flex-grow-1 bg-transparent">
                        <v-list-item v-for="(benefit, index) in tier.benefits" :key="index"
                            prepend-icon="mdi-check-circle-outline">
                            {{ benefit }}
                        </v-list-item>
                    </v-list>

                    <v-btn block color="primary" class="mt-6" size="large"
                        :variant="tier.highlight ? 'flat' : 'outlined'" href="https://stripe.com" target="_blank">
                        Join Now
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>

        <!-- Wall of Fame Section -->
        <v-row class="mt-12">
            <v-col cols="12" class="text-center mb-6">
                <v-divider class="mb-12"></v-divider>
                <h2 class="text-h3 font-weight-bold mb-2">Community Wall of Fame</h2>
                <p class="text-h6 text-medium-emphasis">Thank you to our amazing contributors!</p>
            </v-col>

            <!-- Partners -->
            <v-col cols="12" v-if="sponsors.partners && sponsors.partners.length > 0">
                <div class="text-center mb-8">
                    <h3 class="text-h5 text-uppercase font-weight-bold text-amber mb-6">Transformation Partners</h3>
                    <div class="d-flex justify-center flex-wrap gap-8">
                        <v-card v-for="partner in sponsors.partners" :key="partner.name" :href="partner.url"
                            target="_blank" class="pa-6 d-flex align-center justify-center bg-surface-variant"
                            min-width="200" min-height="120" link>
                            <!-- Use icon for now as placeholder for logo images -->
                            <div class="text-center">
                                <v-icon :icon="partner.logo || 'mdi-domain'" size="40"
                                    class="mb-2 text-medium-emphasis"></v-icon>
                                <div class="font-weight-bold text-h6">{{ partner.name }}</div>
                            </div>
                        </v-card>
                    </div>
                </div>
            </v-col>

            <!-- Patrons -->
            <v-col cols="12" md="6" v-if="sponsors.patrons && sponsors.patrons.length > 0">
                <div class="text-center">
                    <h3 class="text-h6 text-uppercase font-weight-bold text-purple mb-4">Patrons</h3>
                    <div class="d-flex justify-center flex-wrap gap-2">
                        <v-chip v-for="patron in sponsors.patrons" :key="patron.name" color="purple" variant="outlined"
                            size="large" class="font-weight-medium">
                            <v-icon start icon="mdi-star" size="small"></v-icon>
                            {{ patron.name }}
                        </v-chip>
                    </div>
                </div>
            </v-col>

            <!-- Supporters -->
            <v-col cols="12" md="6" v-if="sponsors.supporters && sponsors.supporters.length > 0">
                <div class="text-center">
                    <h3 class="text-h6 text-uppercase font-weight-bold text-blue mb-4">Supporters</h3>
                    <div class="d-flex justify-center flex-wrap gap-2">
                        <v-chip v-for="supporter in sponsors.supporters" :key="supporter" size="default"
                            variant="tonal">
                            {{ supporter }}
                        </v-chip>
                    </div>
                </div>
            </v-col>

        </v-row>

        <!-- Community Wall Section -->
        <v-row class="mt-12">
            <v-col cols="12" class="text-center mb-6">
                <h2 class="text-h4 font-weight-bold">Our Community Wall</h2>
                <p class="text-body-1 text-medium-emphasis">A big thank you to our amazing supporters!</p>
            </v-col>
            <v-col cols="12">
                <v-row justify="center">
                    <v-col v-for="sponsor in sponsors" :key="sponsor.name" cols="auto">
                        <v-avatar :image="sponsor.logo" size="64" rounded="0" class="ma-2"></v-avatar>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import sponsors from '@/data/sponsors.json'

const sponsorshipTiers = [
    {
        name: 'Supporter',
        price: '$10',
        icon: 'mdi-hand-heart',
        color: 'blue',
        benefits: [
            'Access to Discord Community',
            'Early access to new content',
            'Supporter Badge on Profile'
        ]
    },
    {
        name: 'Patron',
        price: '$50',
        icon: 'mdi-star-circle',
        color: 'purple',
        highlight: true,
        benefits: [
            'All Supporter benefits',
            'Monthly Q&A with Ken',
            'Voting rights on future topics',
            'Name in book acknowledgments'
        ]
    },
    {
        name: 'Partner',
        price: '$250',
        icon: 'mdi-trophy',
        color: 'amber',
        benefits: [
            'All Patron benefits',
            '1-on-1 Strategy Session (Quarterly)',
            'Logo on BUMPS.WORLD website',
            'Official "Transformation Partner" status'
        ]
    }
]
</script>

<style scoped>
.gap-4 {
    gap: 16px;
}

.border-primary {
    border: 2px solid rgb(var(--v-theme-primary));
}
</style>
