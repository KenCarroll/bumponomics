<template>
  <div class="triad-container">
    <div class="triad-header">
      <span class="triad-badge">Changing the Conversation</span>
      <p class="triad-lead">In Bumponomics, problem transformation becomes our:</p>
    </div>

    <div class="triad-grid">
      <!-- Card 1: Focus -->
      <div class="triad-card focus-card">
        <div class="card-header">
          <div class="card-icon-wrap focus-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="22" y1="12" x2="18" y2="12"></line>
              <line x1="6" y1="12" x2="2" y2="12"></line>
              <line x1="12" y1="6" x2="12" y2="2"></line>
              <line x1="12" y1="22" x2="12" y2="18"></line>
            </svg>
          </div>
          <h3 class="card-title">Focus</h3>
          <span class="card-num">01</span>
        </div>
        <p class="card-desc">Problems concentrate our attention on what matters</p>
      </div>

      <!-- Card 2: Fuel -->
      <div class="triad-card fuel-card">
        <div class="card-header">
          <div class="card-icon-wrap fuel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3 class="card-title">Fuel</h3>
          <span class="card-num">02</span>
        </div>
        <p class="card-desc">Problems mobilise our time, energy, and resources to take action</p>
      </div>

      <!-- Card 3: Future -->
      <div class="triad-card future-card">
        <div class="card-header">
          <div class="card-icon-wrap future-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <h3 class="card-title">Future</h3>
          <span class="card-num">03</span>
        </div>
        <p class="card-desc">How we transform problems determines our progress.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.triad-container {
  margin: 2.25rem 0;
  padding: 1.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.triad-header {
  margin-bottom: 1.25rem;
}

.triad-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 9999px;
  background: rgba(var(--vp-c-brand-rgb, 59, 130, 246), 0.12);
  color: var(--vp-c-brand);
  margin-bottom: 0.5rem;
}

.triad-lead {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 !important;
}

.triad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .triad-grid {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
}

.triad-card {
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem 1.15rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.triad-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.08);
}

.focus-card:hover {
  border-color: #3b82f6;
}
.fuel-card:hover {
  border-color: #f59e0b;
}
.future-card:hover {
  border-color: #10b981;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.focus-icon {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.fuel-icon {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.future-icon {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 !important;
  border: none !important;
  padding: 0 !important;
  line-height: 1.2;
}

.card-num {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-mute);
  padding: 2px 7px;
  border-radius: 6px;
}

.card-desc {
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0 !important;
}
</style>
