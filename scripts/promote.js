// Thao tác "promote" duy nhất mà con người cần làm khi muốn resto nhận version mới.
// Chỉ sửa registry.source.json — không đụng gì tới resto.
// Dùng: node scripts/promote.js <version>
// Sau khi chạy: commit + push để Vercel build lại và cập nhật public/registry.json.
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Dùng: node scripts/promote.js <version>');
  process.exit(1);
}

const sourcePath = path.join(__dirname, '..', 'registry.source.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
const previous = source.stable;
source.stable = version;
fs.writeFileSync(sourcePath, JSON.stringify(source, null, 2) + '\n');

console.log(`[promote] stable: ${previous} -> ${version}`);
console.log('Nhớ commit + push để deploy:');
console.log(`  git add registry.source.json && git commit -m "promote stable to ${version}" && git push`);
