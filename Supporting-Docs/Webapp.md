# Webapp Strategy: Bumponomics.com

**Goal**: Transform the local "BUMPS-BOOK" markdown repository into a live, interactive Single Page Application (SPA) hosted at www.bumponomics.com.

## 1. Technlogy Stack
Leveraging your existing experience:
*   **Frontend**: Vue 3 (Composition API) + Vite.
*   **UI Framework**: Vuetify 3 (Material Design components).
*   **Backend as a Service (BaaS)**: Firebase.
    *   **Authentication**: Google Sign-in & Email/Password.
    *   **Firestore**: Storing user comments, reactions ("Bumps"), and user profiles.
    *   **Hosting**: Fast, secure global CDN for the app assets.
*   **Content Engine**: Markdown-it (for rendering) + Node.js build scripts.

## 2. AI-Assisted Development Strategy
We will use AI (me, the Agent) as the primary "Junior Developer" and "Architect" to accelerate the build.

### Step A: The Content Pipeline (AI-Scripted)
Instead of a heavy CMS, we keep the "BUMPS-BOOK" markdown files as the Source of Truth.
*   **AI Task**: I will write a Node.js script (`build-content.js`) that runs before the build.
    *   It scans the `/bumps-book` directory.
    *   It parses frontmatter and directory structure.
    *   It generates a `content.json` file—a massive JSON tree of the book structure.
    *   The Vue app loads this JSON to know the TOC and fetch content on demand.

### Step B: Component Generation (AI-Coded)
*   **AI Task**: I will generate the Vuetify components based on your requirements.
    *   `AppDraw.vue`: Navigation sidebar reflecting the book structure.
    *   `ReaderView.vue`: A clean, typography-focused reading pane.
    *   `CommentSidebar.vue`: A slide-out panel for user discussions.

### Step C: Deployment (AI-Guided)
*   **AI Task**: I will guide the Firebase init process and generate the `firebase.json` configuration and GitHub Actions for auto-deployment on push.

## 3. Feature Breakdown

### Phase 1: The "Read" Experience (MVP)
*   Responsive layout (Mobile/Desktop).
*   Dark/Light mode (Vuetify builtin).
*   Dynamic Table of Contents (generated from Markdown headers).
*   SEO meta tags generation (OpenGraph images for sharing).

### Phase 2: The "Social" Experience
*   **User Accounts**: "Log in to discuss."
*   **Marginalia**: Allow users to click on a paragraph and leave a specific comment (Medium-style). This requires assigning unique IDs to blocks or using hash-based anchoring.
*   **Reactions**: A "Bump it" button on chapters or ideas.

### Phase 3: The "Ai" Experience
*   **RAG Chatbot**: "Talk to Bumponomics." Embed an AI chat widget (using Firebase Genkit or OpenAI API) that has "read" the book and can answer user questions about the philosophy, referencing specific chapters.

## 4. Immediate Next Steps / Implementation Plan
1.  Initialize a new Vue project in a `/webapp` folder within the repo (or a sibling repo).
2.  Set up Vuetify & Routing.
3.  Create the `Markdown -> JSON` pipeline script.
4.  Render the first chapter.
