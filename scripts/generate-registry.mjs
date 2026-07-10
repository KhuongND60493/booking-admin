import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const distDir = path.join(rootDir, 'dist')
const pkg = JSON.parse(readFileSync(path.join(rootDir, 'package.json'), 'utf-8'))
const version = pkg.version

// remoteEntry.var.js là bridge global-var (UMD-style) do plugin sinh ra qua option
// `varFilename` trong vite.config.ts — đây là format host (skyresto-webman) đang mong đợi
// (không phải remoteEntry.js dạng ESM mặc định của plugin). Bridge này tham chiếu tương đối
// tới remoteEntry.js (ESM) cùng thư mục lúc runtime, nên file remoteEntry.js gốc PHẢI được
// giữ nguyên tên, không đổi/xoá.
const sourceEntry = path.join(distDir, 'remoteEntry.var.js')
const versionedEntry = path.join(distDir, `remoteEntry.${version}.js`)

if (!existsSync(sourceEntry)) {
  throw new Error(`Không tìm thấy ${sourceEntry} — kiểm tra lại option "varFilename" trong vite.config.ts và output của "vite build" trước khi chạy script này.`)
}
if (!existsSync(path.join(distDir, 'remoteEntry.js'))) {
  throw new Error('Không tìm thấy dist/remoteEntry.js (ESM) — remoteEntry.var.js cần file này tồn tại cùng thư mục lúc runtime.')
}

copyFileSync(sourceEntry, versionedEntry)

const registry = {
  latest: version,
  stable: version,
  updatedAt: new Date().toISOString(),
}

writeFileSync(path.join(distDir, 'registry.json'), JSON.stringify(registry, null, 2))

console.log(`[generate-registry] registry.json + remoteEntry.${version}.js đã sẵn sàng trong dist/`)
