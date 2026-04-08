const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDir = path.join(__dirname, '../content');
const outDir = path.join(__dirname, '../content-new');

function slugify(name) {
    if (name === 'content') return name;
    
    // Remove extension for processing
    const isMd = name.toLowerCase().endsWith('.md');
    let base = isMd ? name.slice(0, -3) : name;

    // Handle leading numbering e.g. "Part 1", "1.1"
    let prefix = '';
    const partMatch = base.match(/^Part\s+(\d+)\s*[-:]*/i);
    const numMatch = base.match(/^(\d+(?:\.\d+)*)\s*[-:]*/i);
    
    if (partMatch) {
        prefix = partMatch[1].padStart(2, '0') + '-'; // "01-"
        base = base.substring(partMatch[0].length).trim();
    } else if (numMatch) {
        prefix = numMatch[1] + '-'; // "1.1-"
        base = base.substring(numMatch[0].length).trim();
    }
    
    let slugged = base
        .toLowerCase()
        .replace(/\(.*?\)/g, '') // remove parens
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
        
    return prefix + slugged + (isMd ? '.md' : '');
}

function extractTitle(filename) {
    const isMd = filename.toLowerCase().endsWith('.md');
    let base = isMd ? filename.slice(0, -3) : filename;
    let title = base;
    
    const partMatch = base.match(/^Part\s+(\d+)\s*[-:]*/i);
    const numMatch = base.match(/^(\d+(?:\.\d+)*)\s*[-:]*/i);
    
    if (partMatch) {
        title = base.substring(partMatch[0].length).trim();
    } else if (numMatch) {
        title = base.substring(numMatch[0].length).trim();
    }
    
    return title.trim() || base;
}

function extractOrder(filename) {
    const isMd = filename.toLowerCase().endsWith('.md');
    let base = isMd ? filename.slice(0, -3) : filename;
    const partMatch = base.match(/^Part\s+(\d+)/i);
    const numMatch = base.match(/^(\d+(?:\.\d+)*)/i);

    if (partMatch) return parseInt(partMatch[1], 10);
    if (numMatch)  return parseFloat(numMatch[1]);
    return 0;
}

function processFile(srcPath, outPath, originalName) {
    let content = fs.readFileSync(srcPath, 'utf8');
    
    let id = '';
    let body = content;
    
    // extract frontmatter if exists
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
    if (match) {
        const fm = match[1];
        body = match[2];
        const idMatch = fm.match(/id:\s*([a-zA-Z0-9-]+)/);
        if (idMatch) {
            id = idMatch[1];
        }
    }
    
    if (!id) {
        id = crypto.randomUUID();
    }
    
    const bodyStr = body.trim();
    const isStub = bodyStr.length < 100 && !bodyStr.includes('#'); 
    const title = extractTitle(originalName);
    const order = extractOrder(originalName);
    
    const newContent = `---
id: ${id}
title: "${title.replace(/"/g, '\\"')}"
description: ""
order: ${order}
status: ${isStub ? 'stub' : 'draft'}
---

${bodyStr}
`;

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, newContent);
}

function walk(dir, currentOutDir) {
    if (!fs.existsSync(currentOutDir)) {
        fs.mkdirSync(currentOutDir, { recursive: true });
    }
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item.startsWith('.')) continue; // Skip hidden
        if (item === 'node_modules') continue;
        
        const srcPath = path.join(dir, item);
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            const outSlug = slugify(item);
            walk(srcPath, path.join(currentOutDir, outSlug));
        } else if (item.toLowerCase().endsWith('.md')) {
            const outSlug = slugify(item);
            processFile(srcPath, path.join(currentOutDir, outSlug), item);
        } else {
            fs.copyFileSync(srcPath, path.join(currentOutDir, item));
        }
    }
}

if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
}

console.log('Walking ' + srcDir);
walk(srcDir, outDir);
console.log('Successfully structured to: ' + outDir);
