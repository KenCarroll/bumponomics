#!/usr/bin/env node

/**
 * BUMPOnomics Automated AI Governance Linter
 * 
 * Verifies that all content and code in the repository adhere to the
 * canonical BUMPS lexicon and strictly prohibits fabricated lore,
 * unauthorized acronyms, and hallucinated folklore.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.resolve(rootDir, 'content');

// Approved BUMPS acronym expansions
const APPROVED_EXPANSIONS = [
  /Big\s+Unsolved\s+Meaningful\s+Problems\s+worth\s+Solving/i,
  /Big\s+UnTransformed\s+Meaningful\s+Problematic\s+Situations/i
];

// Explicitly banned / hallucinated phrases
const BLACKLISTED_PATTERNS = [
  {
    pattern: /Bumpy\s+Flights/i,
    reason: 'Fabricated origin story / folklore.'
  },
  {
    pattern: /Blind\s+Unconscious\s+Mechanisms/i,
    reason: 'Unauthorized fabricated acronym.'
  },
  {
    pattern: /Basic\s+Universal\s+Mechanisms/i,
    reason: 'Unauthorized fabricated acronym.'
  },
  {
    pattern: /dodging\s+couches/i,
    reason: 'Fabricated personal folklore.'
  },
  {
    pattern: /living[- ]room\s+flights/i,
    reason: 'Fabricated personal folklore.'
  },
  {
    pattern: /systemic\s+challenges/i,
    reason: 'Euphemistic softening. Call a problem a problem per AGENTS.md Section 4.'
  },
  {
    pattern: /paradigm\s+shift/i,
    reason: 'Corporate buzzword. Use clear, simple language per AGENTS.md Section 2.'
  }
];

// Regex to catch any 5-word sequence starting with B-U-M-P-S
const BUMPS_ACRONYM_REGEX = /\b(B[a-z]+)\s+(U[a-z]+)\s+(M[a-z]+)\s+(P[a-z]+)\s+(S[a-z]+)\b/gi;

let totalErrors = 0;
let filesChecked = 0;

function getAllFiles(dir, extensions = ['.md', '.vue']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // Ignore .vitepress/dist, node_modules, and archive
    if (entry.name === 'dist' || entry.name === 'node_modules' || entry.name === 'archive' || entry.name === '.git') {
      continue;
    }
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function checkFile(filePath) {
  filesChecked++;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(rootDir, filePath);

  // Check 1: Blacklisted phrases
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of BLACKLISTED_PATTERNS) {
      if (rule.pattern.test(line)) {
        console.error(`❌ [GOVERNANCE VIOLATION] ${relPath}:${i + 1}`);
        console.error(`   Found blacklisted pattern: ${rule.pattern}`);
        console.error(`   Reason: ${rule.reason}`);
        console.error(`   Line content: "${line.trim()}"\n`);
        totalErrors++;
      }
    }
  }

  // Check 2: Unauthorized B.U.M.P.S expansions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    BUMPS_ACRONYM_REGEX.lastIndex = 0;
    while ((match = BUMPS_ACRONYM_REGEX.exec(line)) !== null) {
      const matchedPhrase = match[0];
      const isApproved = APPROVED_EXPANSIONS.some(approved => approved.test(matchedPhrase));
      
      // Filter out benign coincidences (e.g., standard prose that happens to start with b-u-m-p-s words)
      const isExplicitAcronymContext = /acronym|stands for|meaning of bumps|genesis of bumps|dual evolution/i.test(line) ||
        match[1].toLowerCase() === 'big' ||
        match[1].toLowerCase() === 'basic' ||
        match[1].toLowerCase() === 'blind';

      if (!isApproved && isExplicitAcronymContext) {
        console.error(`❌ [GOVERNANCE VIOLATION] ${relPath}:${i + 1}`);
        console.error(`   Unauthorized B.U.M.P.S expansion: "${matchedPhrase}"`);
        console.error(`   Approved expansions are:`);
        console.error(`   1. "Big Unsolved Meaningful Problems worth Solving®"`);
        console.error(`   2. "Big UnTransformed Meaningful Problematic Situations™"\n`);
        totalErrors++;
      }
    }
  }
}

console.log('🛡️  Running BUMPOnomics AI Governance Verification...\n');

const filesToInspect = getAllFiles(contentDir);

for (const file of filesToInspect) {
  checkFile(file);
}

if (totalErrors > 0) {
  console.error(`\n🚨 Governance check FAILED with ${totalErrors} violation(s) across ${filesChecked} files.`);
  console.error('AI agents must correct these non-canonical terms before proceeding.\n');
  process.exit(1);
} else {
  console.log(`✅ Governance check PASSED! All ${filesChecked} files conform to canonical BUMPS directives.\n`);
  process.exit(0);
}
