// Chạy trước "next build" (xem package.json). Sinh public/registry.json từ 2 nguồn:
// - REMOTE_VERSION (env, version đang build) -> latest
// - registry.source.json (commit vào git, chỉ đổi qua scripts/promote.js) -> stable
// resto luôn đọc "stable" lúc runtime nên release ở đây KHÔNG tự động ảnh hưởng resto,
// phải promote thủ công mới đổi được version mà resto dùng.
const fs = require('fs');
const path = require('path');

const REMOTE_VERSION = process.env.REMOTE_VERSION || '1.0.0';

const sourcePath = path.join(__dirname, '..', 'registry.source.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

const registry = {
  latest: REMOTE_VERSION,
  stable: source.stable,
  updatedAt: new Date().toISOString(),
};

const publicDir = path.join(__dirname, '..', 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');

console.log(`[registry] latest=${registry.latest} stable=${registry.stable}`);
