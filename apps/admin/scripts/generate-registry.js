const fs = require('fs');
const path = require('path');

const REMOTE_VERSION = require('../package.json').version;
const isDev = process.argv.includes('--dev');

const sourcePath = path.join(__dirname, '..', 'registry.source.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

const registry = {
    latest: REMOTE_VERSION,
    stable: isDev ? REMOTE_VERSION : source.stable,
    updatedAt: new Date().toISOString(),
};

const publicDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');

console.log(`[registry] latest=${registry.latest} stable=${registry.stable}`);
