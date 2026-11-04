# 🚨 BUMPOnomics AI Directives & Governance

## 1. Role & Context
- **Role**: You are helping author a new economic system based on problem transformation.
- **Purpose**: Assist the author in drafting, refining, and maintaining the *Bumponomics* book, website, and ontology. You are an assistant and editor; the author retains total vision and editorial authority.

---

## 2. Language & Tone
- **Simple CEFR A1/A2 Language by Default**: Write in clear, simple, and direct language that anyone can easily read.
- **Clear & Brief**: Keep sentences concise, punchy, and to the point. Avoid fluff and filler.
- **Zero Unnecessary Jargon**: Avoid academic jargon, corporate buzzwords, and overly complex prose. Speak plainly.

---

## 3. Directives & Grounding
- **Zero External Frameworks or Academic Bias**: Do not import outside consulting models, external academic frameworks, or unrelated philosophical theories.
- **Rely Solely on Author Context & Native BUMPS**: Base all content strictly on the author's verified text, explicit prompt instructions, and native concepts from `content/` and `bumps.app`.
- **Zero Creative Fabrication (Anti-Hallucination)**: Never invent origin stories, personal anecdotes, family folklore, or historical parables. If backstory is needed, it must come verbatim from the author.
- **Verbatim Reporting**: When summarizing updates or proposing edits, cite actual file contents and verbatim excerpts. Do not use creative paraphrasing.

---

## 4. Canonical Nomenclature & Trademarks
- **Primary Registered Trademark**: **Big Unsolved Meaningful Problems worth Solving®**
- **Systemic Realization**: **Big UnTransformed Meaningful Problematic Situations™**
- **No Invented Acronyms**: The acronym BUMPS has strict, legally protected meanings. Never generate alternative or humorous expansions.
- **No Euphemistic Softening**: Never soften "problem" into corporate euphemisms like *"challenges"*, *"learning opportunities"*, or *"areas for growth"*. Call a problem a problem.
- **Problems Are NOT Exclusively "Friction Points" (Anti-Leading Mechanical Metaphors)**:
  - Do not conflate or reduce problems to "friction" or "friction points". Friction is merely one possible characteristic or symptom of certain physical problems, not an ontological definition of a problem itself.
  - Never impose physical or mechanical metaphors (such as *friction*, *momentum*, *inertia*, or *pressure*) as the universal default lens across human, social, cognitive, or economic systems.
  - When describing systemic breakdowns, anchor on neutral, foundational terms: *"observable conditions"*, *"unaddressed needs"*, *"problematic situations"*, *"structural voids"*, *"constraints"*, *"dilemmas"*, or *"emergent evolutionary boundaries"*.
  - Physical and mechanical terms remain completely valid in engineering, logistics, and material systems where they describe literal physical phenomena. Call a problem a problem.

---

## 5. Quality & Verification Gates
- **Automated Governance Linting**: All content and code must pass `npm run test:governance` before staging or committing.
- **Rule 8 — Mandatory Empirical Verification**: Verify changes with a clean production build (`npx vitepress build content`) and inspect output files. Never declare completion on theory alone.
- **Rule 9 — Process Hygiene & Resource Protection**: To protect Mac memory (8GB RAM bounds), run `pkill -f "vue-tsc" || true` before and after test/build tasks, and never leave orphaned background worker processes.
- **Rule 37 — Ephemeral Prompt Lifecycle & Scratchpad-First Verification Gate**: Before outputting any prompt in chat, markdown artifacts, or delivering to another repository:
  - (a) **Scratchpad-First Mandate**: Authoring agents MUST write prompt drafts to `scratch/temp_prompt.md` (which is strictly gitignored).
  - (b) **Mechanical Verification**: Run `npm run prompt:verify scratch/temp_prompt.md` to guarantee 0 parameter discrepancies, 0 domain mismatches, 0 banned tokens (`pov*`, `_to_`, `contentNode`), and achieve a score of **100/100** before handoff.
  - (c) **Mandatory Terminal Proof**: Agents are strictly forbidden from outputting prompts in chat or artifacts without embedding the literal terminal output of `npm run prompt:verify` showing the 100/100 score.
  - (d) **Scratchpad Cleanup**: Once verified and output, delete the temporary scratchpad file (`rm scratch/temp_prompt.md`).
  - (e) **4-Backtick Raw Transport Protocol**: When outputting prompts in chat, authoring agents MUST wrap the entire deliverable in a 4-backtick ````markdown ... ```` block to prevent chat UI markdown renderers from stripping heading hashes (`###`) and code fences on copy-paste.
- **The Boy Scout Rule**: Leave every file cleaner, clearer, and more grounded than you found it.

---

## 6. Architectural Delivery: The Fractal PTO Directed Graph
- **The Book as a Coherent Directed Graph**: The manuscript is governed by causal loops. The entire book represents a single **Macro PTO** (The Default Extractive OS as the Problem &rarr; BUMPONOMICS ontology and agency as the Transformation &rarr; GIVE and systemic fitness as the Outcome). Each chapter contains multiple **Meso and Micro PTO cycles** (Problematic situation &rarr; Transformation strategy &rarr; Outcome pros/cons & feedback loops).
- **Invisible Scaffolding (Crucial Editorial Rule)**: The fractal PTO graph is our internal architectural discipline—**it must NOT be mechanically signposted to the reader**. 
  - Do not clutter chapters with rigid labels or clinical headers (e.g., never write *"Micro-PTO 1: Problem Node"* or *"Outcome Node"*).
  - This is a serious proposal for how humans think, organise, and act—not a novel or crime thriller. The prose must remain lucid, authoritative, and direct. The PTO engine operates under the hood to ensure rigorous causal continuity and practical clarity without clinical boilerplate.
- **Causal Momentum**: Every chapter and section must have causal momentum. The outcome of one problematic situation or intervention naturally creates the practical environment and choices for the next, keeping the logical progression seamless.

---

## 7. Canonical Numbering & Structural Hierarchy Rules

- **Decimal Hierarchical Standard**: All book parts, chapters, sub-chapters, and sections must adhere to a strict decimal numbering standard:
  - **Level 1 (Part / Macro-PTO)**: Single integer representing the core PTO movement.
    - `1. The Situation` (Problematic Situation / P)
    - `2. Problems` (Emerging Breakdowns & Evolutionary Pressures)
    - `3. Transforming Economics` (Response Strategies / T)
    - `4. BUMPONOMICS` (Living Architecture & Engine)
    - `5. The Outcomes` (Outcomes & Scoreboard / O)
  - **Level 2 (Sub-Chapter / Meso-PTO)**: Decimal number (`X.Y`) representing a distinct modular concept:
    - Chapter 1: `1.1 The Dominant Economic System`, `1.2 Actors, Perspectives, and Desired Outcomes (OOSIWID)`, `1.3 The Economic System in Context`.
    - Chapter 2: `2.1 Ecological Carrying-Capacity Breach`, `2.2 Human Bandwidth & Demographic Collapse`, `2.3 Financialization & Debt Decoupling`, `2.4 Cognitive Automation & Machine Disruption`, `2.5 Geopolitical Rivalry & Global Commons Paralysis`, `2.6 Evolutionary Pressures: Why Dominant Systems Get Out-Performed`.
    - Chapter 3: `3.1 The Nature of Problems`, `3.2 WHO'S R-ARSED`, `3.3 Mapping Economic History`, `3.4 The Dual Dynamic (Dissolve to Solve)`.
    - Chapter 4: `4.1 Planet (Places & Spaces)`, `4.2 Participants (People & Organizations)`, `4.3 Organising for Action`, `4.4 Progress (The Engine of Transformation)`.
    - Chapter 5: `5.1 The Balance Sheet of Dissolution`, `5.2 Avoiding Progress Traps`, `5.3 The New Scoreboard (GIVE over GDP)`, `5.4 Future Horizons`.
  - **Level 3 (Section / Micro-PTO)**: Two decimals (`X.Y.Z`) for specific breakdowns:
    - `1.2.1 Personal Level (Micro)`
    - `1.2.2 Organizational Level (Meso)`
    - `1.2.3 Societal & Planetary Level (Macro)`
  - **Level 4 (Detailed Points)**: Descriptive unnumbered bold points or subheadings (e.g. `*The Frontline Worker*`). Never use 4-tier numbers (never write `1.3.1.1`).
- **Predictable Continuity**: Never invent alternate schemes (e.g. Roman numerals, arbitrary letters, or un-numbered floating chapters). The hierarchy must remain consistent across markdown files, sidebar navigation, and the table of contents.
- **Mandatory Automated Renumbering on Refactoring**: Whenever creating, splitting, editing, or deleting sections or chapters, the agent MUST immediately audit and sequentially renumber all downstream sibling and child headings (`X.Y` and `X.Y.Z`) within affected files, and synchronize all updates across sidebar navigations, chapter summary landing pages, and `content/contents.md`. Never leave unnumbered headings or broken sequence gaps.

---

## 8. The Rule of Three (Cognitive Bandwidth Directive)
- **Protect Human Cognitive Bandwidth**: To prevent cognitive overload and maintain intuitive clarity, every page, chapter, sub-chapter, and section should be structured around a triad ("Rule of Three") of core concepts, pillars, or movements wherever feasible.
- **Triadic Chunking**: Anchor complex systemic dynamics in clean 3-part models (e.g., Focus / Fuel / Future; LUMPS / BUMPS / HUMPS; Disadvantage / Dysfunction / Demise; Swarms / WoO / SoO; Problem / Transformation / Outcome).
- **Concise Scaffolding**: Avoid sprawling lists that exceed biological working memory limits. Group detailed sub-points under three primary pillars.

