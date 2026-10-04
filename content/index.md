---
id: 3c889597-fdeb-4e10-ae8c-9c1d0f520b50
title: "BUMPONOMICS"
description: "The Playbook for Turbulent Worlds"
order: 0
status: active
layout: home

hero:
  name: "BUMPONOMICS"
  text: "The Economics of Progress"
  tagline: "A scalable, practical playbook to help individuals, organizations, and societies transform their problems into progress.<br><br><span class='version-stamp'>version: October 2026 <span class='version-tooltip' data-text='Bumponomics is under continuous development!'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22' width='22' height='22' fill='currentColor'><path d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' /></svg></span></span>"
  image:
    src: /bumps-logo.svg
    alt: BUMPS Logo
---

<div style="font-size: 1.15rem; line-height: 1.8; max-width: 780px; margin: 0 auto;">

## The Core Idea

Economics has become humanity’s master operating system. But it has many problems. Not least of which is that it appears to be driven by its own growth, and that growth may be at our expense.

But we have options. 

Bumponomics is one of them. It offers a pragmatic, viable course correction.

When adopted by individuals, teams, and societies it will amplify micro actions to create progressive macro movements. 

What does Bumponomics do differently? 

Bumponomics is unique because it places problems at the very heart of its operating system. Problems are no longer seen as something negative that gets in the way. Instead they become the very driver of our progress.

<FocusFuelFuture />

This is a fundamentally optimistic approach to progress. It acknowledges the many real problems we face as a species. But it refuses to be paralyzed by them. Instead it invites us to embrace them as opportunities. It is a call to action. A call to organise. A call to transform our problems into progress. 

BUMPONOMICS will change how you think, decide, and act. And it will drastically improve your ability to make progress and succeed.

<div class="bottom-cta-wrap">
  <a href="/p1-the-blind-emergence/01-myth-of-the-broken-system" class="bottom-brand-btn"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z" /></svg> Enter Bumponomics &rarr;</a>
  <a href="#toc" class="bottom-toc-link">Contents &rarr;</a>
</div>

</div>

<style>
/* Tighten whitespace between hero and Core Idea */
.VPHero {
  padding-bottom: 24px !important;
}

.VPHome .vp-doc {
  padding-top: 0 !important;
}

#the-core-idea {
  margin-top: 0.5rem !important;
  padding-top: 0 !important;
}

.bottom-cta-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
  margin-bottom: 2rem;
}

.bottom-brand-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--vp-c-brand);
  color: white !important;
  border-radius: 24px;
  font-weight: 600;
  text-decoration: none !important;
  transition: background 0.2s, transform 0.2s;
}
.bottom-brand-btn:hover {
  background: var(--vp-c-brand-dark, var(--vp-c-brand));
  transform: translateY(-1px);
}

.bottom-toc-link {
  color: var(--vp-c-text-2) !important;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 4px 10px;
  cursor: pointer;
  text-decoration: none !important;
  transition: color 0.2s ease, opacity 0.2s ease;
}
.bottom-toc-link:hover {
  color: var(--vp-c-brand) !important;
  text-decoration: underline !important;
}

@media (max-width: 639px) {
  .VPHero .name {
    font-size: clamp(32px, 10.5vw, 46px) !important;
    line-height: 1.1 !important;
  }
  .VPHero .text {
    font-size: clamp(20px, 6vw, 26px) !important;
  }
}

.version-stamp {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  font-weight: normal;
  display: inline-flex;
  align-items: center;
}

.version-tooltip {
  position: relative;
  cursor: pointer;
  opacity: 0.6;
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s;
}

.version-tooltip:hover {
  opacity: 1;
}

.version-tooltip::after {
  content: attr(data-text);
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translate(-50%, -100%);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
  width: max-content;
  max-width: min(280px, 90vw);
  white-space: normal;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border: 1px solid var(--vp-c-divider);
  z-index: 100;
}

.version-tooltip::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: var(--vp-c-bg-soft) transparent transparent transparent;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 101;
}

.version-tooltip:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, calc(-100% - 4px));
}

.version-tooltip:hover::before {
  opacity: 1;
  visibility: visible;
  top: -16px;
}
</style>
