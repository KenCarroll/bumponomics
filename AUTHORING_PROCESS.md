# Bumponomics Authoring Process & Roles

Publishing a foundational, theory-heavy book like **Bumponomics** requires balancing deep intellectual rigor with high accessibility. Because this repository acts as a true "Headless Content" and Ontology source, the authoring process is a collaborative loop between the Human Visionary and the AI Assistant.

Below are the defined roles and responsibilities to reference as we progress.

---

## 1. The Visionary / Lead Author (Ken)
**The Role:** The source of the core theory, the philosophical direction, and the "Why."
**Responsibilities:**
- Write the raw ideas, brain-dumps, and unconstrained drafts.
- Define the terminology and make the executive decisions on what the theory *is*.
- Dictate the priorities of what chapters need to be attacked next.

## 2. The Developmental Editor (AI)
**The Role:** The Architect responsible for macro-structure, pacing, and narrative coherence. 
**Responsibilities:**
- Look at the entire book holistically.
- Ask challenging structural questions: *"Is the transition from 'The Core Thesis' to 'MegaTrends' too abrupt?"*
- Identify logical gaps, consolidate redundant files, and ensure the "Hero's Journey" of the reader flows perfectly.

## 3. The Ontologist / Systems Synthesizer (AI)
**The Role:** The enforcer of absolute theoretical consistency.
**Responsibilities:**
- Ensure BUMPS terms (HUMPS, LUMPs, PTO Process) are strictly adhered to.
- If a "BUMP" is mathematically defined in the ontology package (`src/`), ensure the prose perfectly reflects that definition.
- Prevent terms from drifting or changing subtly halfway through the manuscript.

## 4. The Line / Copy Editor (AI)
**The Role:** The meticulous prose polisher. 
**Responsibilities:**
- Fix the prose, remove passive voice, and untangle overly complex sentences.
- Ensure a single, authoritative tone of voice across the entire manuscript.
- Execute structural "cleanups" of markdown files once the Visionary blesses the raw draft.

## 5. The Visual / Information Designer (Collaborative)
**The Role:** The translator of spatial systems thinking into visual models.
**Responsibilities:**
- **Visionary:** Provide the high-fidelity visualizations via the BUMPS graphics engine.
- **AI:** Generate and inject rapid `mermaid.js` diagrams directly into the markdown to prototype visual concepts before they are fully rendered in the graphics engine.

## 6. The Publisher / Technologist (Automated / AI)
**The Role:** Handling the typesetting, distribution, routing, and packaging.
**Responsibilities:**
- Maintain the VitePress local reading environment.
- Run the structural/formatting scripts (`scripts/refactor_content.js`).
- Manage the NPM package exports so `bumps.app` can consume the finished content dynamically.

---

### How to use this document:
Whenever a new chapter is opened, default to the Visionary role. Dump your thoughts, and explicitly ask the AI to put on the *Developmental Editor* hat (to evaluate the ideas) or the *Line Editor* hat (to polish the prose).
