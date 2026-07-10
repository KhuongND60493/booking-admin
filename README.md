# booking-admin

Remote micro-frontend demo cho resto (`skyresto-webman`), expose qua Module Federation.

- Next.js (Pages Router) + `output: 'export'` — build ra static HTML/JS/CSS thuần, không cần server runtime lúc chạy
- Module Federation qua webpack `ModuleFederationPlugin` gốc (`next.config.js`), expose `ReservationsPage` và `TablesPage`
- Dữ liệu hiển thị là mock (`mocks/`), không gọi API thật

## Chạy standalone

```bash
pnpm install
pnpm dev        # http://localhost:3001
```

## Build (static export + registry.json)

```bash
pnpm build      # sinh public/registry.json rồi next build --output export
```

Output nằm ở `out/` — deploy thẳng thư mục này lên bất kỳ static host/CDN nào (Vercel, S3, Cloudflare Pages...).

## Version / registry

- `registry.source.json` (commit vào git) — nguồn `stable` version mà **resto luôn đọc lúc runtime**
- `public/registry.json` (sinh tự động lúc build, không commit) — kết hợp `latest` (bản build hiện tại) và `stable` (từ `registry.source.json`)
- Muốn resto nhận version mới: `pnpm promote <version>` rồi commit + push (build/deploy lại)

## Lưu ý kỹ thuật quan trọng

`shared.react` / `shared.react-dom` trong `next.config.js` **không được set `eager: true`** —
đã verify thực tế: bật `eager: true` khiến `@module-federation/runtime` (package host đang
dùng để consume remote) lỗi `RUNTIME-001: Failed to get remoteEntry exports` khi gọi
`loadRemote()`. Tắt `eager` thì `loadRemote()` hoạt động đúng, trả về `{ default: Component }`.
