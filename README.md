---
id: 1a6547bb-ffc7-429a-90de-405c1f5ac243
---
# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

<p align="center">
  <img src="./content/public/images/bumps.svg" alt="BUMPS Logo" width="150"/>
</p>

# BUMPONOMICS: A Viable Economic Model (VEM) for Environmental Enrichment

This repository contains the core text, thesis, and digital documentation for the **Bumponomics Book**, presenting a profound evolution in systems thinking and economic design.

## Core Philosophy

Moving away from the extractive traps of traditional GDP and Problem-Solving Economics (which focuses on creating static physical products and services), Bumponomics introduces the **Viable Economic Model (VEM)** for a Problem-Transforming Economy. Challenging and building upon Stafford Beer's Viable System Model (VSM), Bumponomics treats the environment not as an externality to be exploited, but asserts that a Viable Economic Model is fundamentally a **Viable Environment Model**. Organizations act as entities that *serve* and enrich their environment—ideally creating more organic life forms that have their own agency, giving them the opportunity to make connections and increase the 'variety' of the ecosystem.

Replacing financial profit as the ultimate metric, Bumponomics measures progress through:
1. **GMP (Gross Meaningful Problems):** Measuring Ambition.
2. **GPO (Gross Positive Outcomes):** Measuring Efficacy.
3. **GIVE (Gross Increased Variety of Environment):** Measuring Legacy.

The mechanism driving this progress is the **PTO Process** (Problems → Transformations → Outcomes), effectively creating a "Progress Economy" powered by Big Untransformed Meaningful Problematic Situations (BUMPS).

## Application
The application to render this book is located in the `ABookWebApp` repository.

## Structure
- **content/**: Markdown files organized by Part and Chapter.
- **CONTENTS.md**: Auto-generated Table of Contents.

## Deployment (Firebase Hosting)

To deploy the Bumponomics book to a live custom URL (e.g., `www.bumponomics.com`), we use Firebase Hosting to serve the static generated files.

### 1. Build the Book
Run the following command to compile the VitePress markdown into optimized static HTML files:
```bash
npm run build
```
*(This outputs the final build securely into `content/.vitepress/dist`)*

### 2. Initialize Firebase
If Firebase is not yet initialized in this directory, run:
```bash
firebase init hosting
```
- Select your existing BUMPS Firebase project.
- **Public Directory:** Enter `content/.vitepress/dist`
- **Configure as single-page app:** Enter `N` (No).
- **Set up automatic builds with GitHub:** Enter `Y` (Yes) for continuous deployment of new chapters.

### 3. Deploy
To push the live book to the internet, run:
```bash
firebase deploy --only hosting
```

### 4. Custom Domain Setup
- Open your [Firebase Console](https://console.firebase.google.com/) and go to **Hosting**.
- Click **Add Custom Domain** and enter your desired URL (e.g., `bumponomics.com`).
- Take the provided DNS `A` and `TXT` records and add them to your domain registrar (GoDaddy, Google Domains, etc.).
- Firebase will automatically secure the site with a free SSL certificate.

## License and Intellectual Property

**© 2026 Bumpconductor BV. All rights reserved.**  
BUMPONOMICS™ and BUMPS™ are trademarks of Bumpconductor BV. Created by Ken Carroll.

This work is licensed under a [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](http://creativecommons.org/licenses/by-nc-nd/4.0/). See the `LICENSE.md` file for detailed terms.
