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

// Chapter 3
console.log("Building 03-missions-vs-problems.md...");
let c3 = readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/missions-v-problems.md');
writeFrontmatter('03-missions-vs-problems.md', 'Missions vs Problems', 3);
fs.appendFileSync(path.join(setupDir, '03-missions-vs-problems.md'), c3);

// Chapter 4
console.log("Building 04-the-infinite-game.md...");
let c4 = [];
c4.push(readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/game-theory-and-problems.md'));
c4.push(readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/types-of-organising.md'));
writeFrontmatter('04-the-infinite-game.md', 'The Infinite Game', 4);
fs.appendFileSync(path.join(setupDir, '04-the-infinite-game.md'), c4.filter(x => x).join('\n\n---\n\n'));

// Chapter 5
console.log("Building 05-the-ten-megatrends.md...");
let c5 = [];
const megaDir = path.join(setupDir, '1.2-megatrends');
if (fs.existsSync(megaDir)) {
    const files = fs.readdirSync(megaDir).filter(f => f.endsWith('.md')).sort((a,b) => {
        const m1 = a.match(/1\.2\.(\d+)/);
        const m2 = b.match(/1\.2\.(\d+)/);
        const numA = m1 ? parseInt(m1[1]) : 0;
        const numB = m2 ? parseInt(m2[1]) : 0;
        return numA - numB;
    });
    for (const file of files) {
        c5.push(fs.readFileSync(path.join(megaDir, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim());
    }
}
writeFrontmatter('05-the-ten-megatrends.md', 'The Ten Megatrends', 5);
fs.appendFileSync(path.join(setupDir, '05-the-ten-megatrends.md'), c5.filter(x => x).join('\n\n---\n\n'));

// Theory
console.log("Preserving theory.md as 06-algebra-of-agency.md...");
let theory = readSafe('1.1-setting-the-scene/1.6-the-problems-with-problems/theory.md');
writeFrontmatter('06-algebra-of-agency.md', 'The Algebra of Agency', 6);
fs.appendFileSync(path.join(setupDir, '06-algebra-of-agency.md'), theory);

console.log("Chapters 3 to 6 merged successfully.");
