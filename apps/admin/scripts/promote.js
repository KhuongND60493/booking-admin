const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
    console.error('Use: node scripts/promote.js <version>');
    process.exit(1);
}

const sourcePath = path.join(__dirname, '..', 'registry.source.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
const previous = source.stable;
source.stable = version;
fs.writeFileSync(sourcePath, JSON.stringify(source, null, 2) + '\n');

console.log(`[promote] stable: ${previous} -> ${version}`);
console.log(`  git add registry.source.json && git commit -m "promote stable to ${version}" && git push`);
