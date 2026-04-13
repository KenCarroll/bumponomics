const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const setupDir = path.join(__dirname, '../content/01-the-setup');

function readSafe(relPath) {
    const p = path.join(setupDir, relPath);
    if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    }
    return '';
}

function writeFrontmatter(filePath, title, order) {
    const p = path.join(setupDir, filePath);
    const fm = `---\nid: ${crypto.randomUUID()}\ntitle: "${title}"\ndescription: ""\norder: ${order}\nstatus: draft\n---\n\n`;
    fs.writeFileSync(p, fm);
}

// Chapter 1
console.log("Building 01-the-core-thesis.md...");
let c1 = [];
c1.push(readSafe('1-x-reasoning.md'));
c1.push(readSafe('1.1-the-core-thesis.md'));
c1.push(readSafe('1.4-progress-people-problems.md'));
c1.push(readSafe('1.1-setting-the-scene/1-x-economics-in-a-nutshell.md'));
writeFrontmatter('01-the-core-thesis.md', 'The Core Thesis', 1);
fs.appendFileSync(path.join(setupDir, '01-the-core-thesis.md'), c1.filter(x => x).join('\n\n---\n\n'));

// Chapter 2
console.log("Building 02-the-physics-of-problems.md...");
let c2 = [];
c2.push(readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/thermodynamics.md'));
c2.push(readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/quantum-mechanics-of-problems.md'));
c2.push(readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/complexity.md'));
c2.push(readSafe('1.1-setting-the-scene/cybernetics.md'));
writeFrontmatter('02-the-physics-of-problems.md', 'The Physics of Problems', 2);
fs.appendFileSync(path.join(setupDir, '02-the-physics-of-problems.md'), c2.filter(x => x).join('\n\n---\n\n'));

console.log("Chapters 1 & 2 merged successfully.");
