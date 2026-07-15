# skybooking-webman — Project Overview

> **Trạng thái:** Đã cập nhật theo kiến trúc Turborepo monorepo hiện tại (2026-07-06)
> **Cập nhật lần cuối:** 2026-07-06
>
> ⚠️ File này là **knowledge base trung tâm** cho cả Cursor AI và Claude Code.
> **Cursor** đọc file này khi implement (`/implement`).
> **Claude** đọc file này khi viết SPEC (`/spec`) và PLAN (`/plan`).
> Giữ file này **luôn cập nhật** sau mỗi lần thay đổi architecture.

---

## 1. Thông tin dự án

| Field | Value |
|-------|-------|
| Tên project | skybooking-webman |
| Kiến trúc | Turborepo monorepo (Yarn workspaces) — 2 app + 4 package dùng chung |
| Runtime | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, responsive `md:`/`lg:` (không có breakpoint tablet riêng) |
| Page-builder | `@measured/puck` (Server-Driven UI / SDUI), registry **theo từng trang** |
| Database | Chưa có — BE thật (nếu có) ở project/service khác; fallback mock/file JSON trong `packages/api-client/data/` |
| Package manager | Yarn (workspaces), KHÔNG dùng pnpm/npm |
| Deployment | Chưa xác định |
| Môi trường | Dev (demo), domain nghiệp vụ: đặt bàn nhà hàng đa thương hiệu (F&B) |

---

## 2. Cấu trúc thư mục

```
skybooking-webman/
├── apps/
│   ├── booking/                          ← App khách hàng (Next.js App Router)
│   │   ├── app/[tenant]/                    Trang chủ — chọn nhà hàng
│   │   ├── app/[tenant]/[storeId]/          Store Detail — chọn ngày/giờ/số khách
│   │   ├── app/[tenant]/[storeId]/tables/   Table Selection — chọn bàn theo khu vực
│   │   ├── app/[tenant]/[storeId]/info/     Customer Info — thông tin liên hệ
│   │   ├── app/[tenant]/[storeId]/otp/      OTP — xác thực + tạo booking thật
│   │   ├── app/[tenant]/[storeId]/success/  Success — xác nhận thành công
│   │   ├── app/[tenant]/[storeId]/waitlist/ Waitlist — đăng ký chờ bàn
│   │   ├── app/actions.ts                   Server Action: theme/config/booking/waitlist
│   │   └── app/BookingPageShell.tsx          set theme runtime + BookingContext cho toàn app
│   │
│   └── admin/                            ← App quản trị (Next.js App Router)
│       ├── app/bookings/                    Danh sách booking (KPI + filter + bảng)
│       ├── app/bookings/new/                Wizard 4 bước tạo booking (không OTP)
│       ├── app/waitlist/                    Danh sách chờ + Convert → booking thật
│       ├── app/edit-layout/                 Chọn 1/7 trang để chỉnh layout (Puck)
│       ├── app/edit-layout/[page]/          Puck builder scoped đúng 1 trang
│       ├── app/edit-layout/theme/           Cấu hình theme (màu + font) cho store
│       ├── app/components/AdminSidebar.tsx  Sidebar 4 menu cố định
│       └── app/actions.ts                   Server Action dùng chung admin
│
├── packages/
│   ├── ui/                               ← Component theo trang, chia nhỏ theo khối UI
│   │   ├── home/            PageHeader1, BrandFilterBar1, StoreList1
│   │   ├── store-detail/    StoreHeader1, DateTimePartyForm1
│   │   ├── table-selection/ ZoneTabs1, TableGridBody1, TableSelectionSummary1
│   │   ├── customer-info/   ContactInfoForm1
│   │   ├── otp/             OtpHeader1, OtpCodeInput1
│   │   ├── success/         SuccessHeader1, SuccessActions1
│   │   ├── waitlist/        WaitlistIntro1, WaitlistFormFields1, WaitlistDone1
│   │   └── shared/          BookingSummaryCard1 (dùng chung Customer Info + Success)
│   │
│   ├── hooks/                             ← Business logic — component KHÔNG tự gọi API
│   │   ├── BookingContext.tsx              Context TOÀN CỤC: tenant/storeId/baseUrl + action
│   │   ├── StoreListContext.tsx             Context CẤP TRANG (Home) — share filter+list state
│   │   ├── TableSelectionContext.tsx        Context CẤP TRANG (Table Selection) — share zone/bàn
│   │   ├── usePageTheme.ts                  Set CSS variable runtime từ StoreTheme
│   │   ├── bookingDraft.ts                  Lưu state tạm giữa các trang (sessionStorage)
│   │   └── use*.ts                          1 hook / luồng nghiệp vụ
│   │
│   ├── puck-config/                       ← Registry Puck THEO TỪNG TRANG (không phải 1 global)
│   │   ├── pages/*.config.tsx               7 file — mỗi file = registry riêng 1 trang
│   │   └── index.ts                         pageConfigs, getConfigForPage(), toPuckData()
│   │
│   └── api-client/                        ← Gọi BE thật, fallback mock/file khi lỗi
│       ├── index.ts                         Entry CLIENT-SAFE (fetch only, không dùng fs)
│       ├── server.ts                        Entry SERVER-ONLY (dùng fs) — Page/Theme/Booking/Waitlist
│       └── data/                            Fallback file JSON (mock BE cho demo)
│
└── docs/, .ai/                            ← Tài liệu + SPEC/PLAN theo ROMIO AI Workflow
```

---

## 3. Architecture Patterns

### 3.1 Server-Driven UI (SDUI) qua Puck — registry theo từng trang
- Mỗi trong 7 trang booking có **registry Puck riêng** (`packages/puck-config/src/pages/*.config.tsx`)
  — khi admin chọn 1 trang để chỉnh sửa, chỉ load đúng component của trang đó, không load
  toàn bộ component của mọi trang cùng lúc.
- Output JSON (`PageConfigData.components`) **chỉ chứa `type` + `props`**, không bao giờ chứa
  logic/code thực thi — ranh giới bảo mật cốt lõi.
- Admin (`apps/admin/app/edit-layout/[page]`) dùng `<Puck />` để kéo-thả và publish.
- Khách hàng (`apps/booking`) dùng `<Render />` để render đúng theo config đã publish.

### 3.2 Mỗi trang chia thành NHIỀU component con theo khối UI
- Không gộp UI của 1 trang thành 1 component lớn — mỗi khối UI rõ ràng (header, form, danh
  sách, tổng kết...) là 1 component riêng, admin sắp xếp/tuỳ chỉnh độc lập từng khối.
- Ví dụ trang Home: `PageHeader1` (tiêu đề) + `BrandFilterBar1` (chip lọc) + `StoreList1`
  (danh sách nhà hàng) — 3 component riêng biệt thay vì 1 `StoreCard1` gộp chung.

### 3.3 Context cấp trang cho component con chia sẻ state
- Khi nhiều component con **cùng 1 trang** cần chia sẻ state tương tác qua lại (vd chọn brand
  filter phải ảnh hưởng danh sách store hiển thị; chọn zone phải ảnh hưởng lưới bàn), dùng
  **context cấp trang** thay vì mỗi component tự gọi hook riêng (sẽ tạo state không đồng bộ):
  - `StoreListProvider`/`useStoreListContext()` — trang Home
  - `TableSelectionProvider`/`useTableSelectionContext()` — trang Table Selection
- Khác với `BookingContextProvider` (context **toàn cục**: tenant/storeId/baseUrl + Server
  Action, bọc toàn bộ 1 route booking qua `BookingPageShell`).
- Các trang còn lại (Store Detail, Customer Info, OTP, Success, Waitlist) không cần context
  cấp trang vì component con chỉ đọc chung `bookingDraft` (sessionStorage) hoặc dữ liệu tĩnh
  không phụ thuộc lẫn nhau.
- **Lưu ý triển khai**: bất kỳ nơi nào render Puck cho trang Home/Table Selection (cả
  `apps/booking` lẫn preview trong `apps/admin/app/edit-layout/[page]`) đều phải bọc đúng
  Provider tương ứng, nếu không sẽ throw runtime error.

### 3.4 Component variant vs. Custom hook
- **Component** (trong `packages/ui`) chỉ lo layout/JSX, **không** tự viết state hay gọi API.
- **Logic nghiệp vụ** nằm trong custom hook dùng chung (`packages/hooks`), theo nhóm chức
  năng (1 hook / luồng nghiệp vụ), không phải theo từng biến thể UI.

### 3.5 Theming — config-driven, không hardcode
- Theme (màu `primary`/`background`/`text`/`textMuted` + font `heading`/`body`) là dữ liệu
  cấu hình cấp **Store** (`StoreTheme` trong `@skybooking/api-client`), KHÔNG hardcode giá
  trị mặc định cứng trong `globals.css`/`tailwind.config.ts`.
- Admin cấu hình qua `apps/admin/app/edit-layout/theme` (dùng `loadStoreThemeAction`/
  `saveStoreThemeAction`).
- Áp dụng runtime qua `usePageTheme(theme)` — set CSS variable (`--color-primary`,
  `--font-heading`, `--font-body`...) lên `document.documentElement` (toàn app `apps/booking`)
  hoặc 1 phần tử cụ thể (preview scoped trong admin), kèm nạp Google Fonts động theo tên
  font trong config.

### 3.6 Ranh giới Client-safe vs. Server-only trong `@skybooking/api-client`
- File nào dùng `fs` (đọc/ghi fallback JSON) chỉ export qua **`./server`** — KHÔNG được import
  trực tiếp trong client component (sẽ kéo `fs` vào bundle trình duyệt, lỗi runtime).
- Client-safe (fetch-only, an toàn import trực tiếp): `searchTables`, `getMenu`, `listStores`,
  `getStore`, `sendOtp`, `verifyOtp`.
- Server-only (dùng `fs`, chỉ qua Server Component hoặc Server Action): `getPageConfig`/
  `savePageConfig`, `getStoreTheme`/`saveStoreTheme`, `listBookings`/`createBooking`/
  `updateBooking`/`cancelBooking`, `listWaitlist`/`submitWaitlist`/`convertWaitlist`.
- Client component cần gọi code server-only phải đi qua Server Action riêng của từng app
  (`apps/booking/app/actions.ts`, `apps/admin/app/actions.ts`) — không có Next.js API Route
  Handler (`app/api/`) nào trong dự án này.

### 3.7 Đa nhà hàng trong 1 tenant (multi-store)
- Khách chọn nhà hàng cụ thể (`storeId`) ở Trang chủ trước khi vào luồng đặt bàn.
- Route dạng `apps/booking/app/[tenant]/[storeId]/...` — 1 tenant có thể có nhiều `Store`.

### 3.8 Responsive
- Mọi component trong `packages/ui` responsive mobile (mặc định) + desktop (`md:`/`lg:`),
  không có breakpoint tablet riêng.

---

## 4. Luồng nghiệp vụ chính

### Flow 1: Đặt bàn (khách hàng, `apps/booking`)
```
Home (chọn nhà hàng) → Store Detail (ngày/giờ/số khách) → Table Selection (chọn bàn)
  → Customer Info (thông tin liên hệ) → OTP (xác thực → tạo Booking thật)
  → Success (mã đặt bàn) | rẽ nhánh → Waitlist (nếu hết bàn)
```

### Flow 2: Admin publish layout 1 trang
```
Admin → /edit-layout → chọn 1/7 trang → /edit-layout/[page]
      → Puck builder (chỉ registry của đúng trang) → kéo-thả → Publish
      → savePageConfigAction → @skybooking/api-client/server → BE thật hoặc file JSON fallback
```

### Flow 3: Admin cấu hình theme
```
Admin → /edit-layout/theme → loadStoreThemeAction → chỉnh màu/font
      → saveStoreThemeAction → apps/booking đọc theme mới ở lần load tiếp theo
```

### Flow 4: Admin quản lý booking/waitlist
```
Admin → /bookings (KPI + filter + bảng, xem booking khách hàng tạo)
Admin → /bookings/new (wizard 4 bước: nhà hàng+giờ → chọn bàn → thông tin khách → xong, KHÔNG OTP)
Admin → /waitlist → Convert → kiểm tra bàn → tạo Booking thật
```

---

## 5. Conventions

### Naming
| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component (theo khối UI) | `[TênKhối][SốThứTựBiếnThể]` | `PageHeader1`, `StoreList1`, `ZoneTabs1` |
| Custom hook | `use[ChứcNăng]` | `useStoreDetail`, `useOtpVerification` |
| Context cấp trang | `[TênTrang]Provider` + `use[TênTrang]Context` | `TableSelectionProvider`, `useTableSelectionContext` |
| Server Action | `[động từ][Entity]Action` | `loadPageConfigAction`, `createBookingAction` |
| Route (App Router) | folder theo path, dynamic segment `[param]` | `app/[tenant]/[storeId]/tables/page.tsx` |
| Puck registry file | `[pageKey].config.tsx` | `tableSelection.config.tsx` |

### Nguyên tắc bắt buộc
- Component **không** tự viết state/gọi API — logic luôn nằm trong hook dùng chung.
- Component con cùng 1 trang cần share state tương tác → dùng context cấp trang, không gọi
  hook riêng lẻ từng component.
- JSON từ Puck **không bao giờ** chứa logic thực thi, chỉ `type` + `props`.
- Theme qua CSS variable, set runtime — không hardcode giá trị mặc định cứng cho brand cụ thể.
- Code dùng `fs` trong `@skybooking/api-client` chỉ export qua `./server`, gọi từ client
  component phải qua Server Action riêng của app.

---

## 6. Infrastructure Highlights

### Fallback storage (hiện tại)
- `packages/api-client/data/` — file JSON local, dùng khi gọi BE thật thất bại (mọi entity:
  PageConfig, StoreTheme, Booking, Waitlist).
- Path tính theo `process.cwd()` (thư mục app đang chạy) + path tương đối cố định lên
  `packages/api-client/data` — KHÔNG dùng `__dirname` (sẽ sai sau khi Next.js bundle).

### Chuyển sang BE thật
- Set `NEXT_PUBLIC_BE_API_URL` trong `.env.local` của từng app — `@skybooking/api-client` tự
  gọi BE thật trước, chỉ fallback về file JSON khi BE lỗi/không cấu hình.
- Contract API hiện là giả định (`{BE_API_URL}/pages/{tenant}`, `/stores`, `/bookings`,
  `/waitlist`, `/otp/*`...) — cần xác nhận lại khi tích hợp BE thật.

---

## 7. Build & Run Commands

```bash
# Install dependencies (từ root)
yarn install

# Dev server — cả 2 app cùng lúc (booking :3000, admin :3001)
yarn dev

# Build — turbo build cho cả 2 app
yarn build

# Lint
yarn lint
```

---

## 8. Getting Started (Developer Onboarding)

1. `yarn install`
2. Copy `.env.local.example` → `.env.local` cho cả `apps/booking` và `apps/admin`
3. `yarn dev`
4. Mở `http://localhost:3000/demo-tenant` — trang chủ khách hàng
5. Mở `http://localhost:3001/bookings` — admin portal

**Tips:**
- Khi thêm component mới cho 1 trang: đặt trong `packages/ui/src/[tên-trang]/`, đăng ký
  trong `packages/puck-config/src/pages/[pageKey].config.tsx`, đặt logic vào hook tương ứng
  trong `packages/hooks/`.
- Khi 1 trang cần nhiều component chia sẻ state: tạo context cấp trang mới trong
  `packages/hooks/` (theo pattern `StoreListContext.tsx`/`TableSelectionContext.tsx`), nhớ bọc
  Provider ở CẢ `apps/booking` route lẫn `apps/admin/app/edit-layout/[page]/page.tsx` (preview).
- Khi thêm entity mới cần gọi BE: thêm vào `packages/api-client/src/` theo đúng ranh giới
  client-safe (`index.ts`) vs. server-only (`server.ts`), viết Server Action wrapper ở app cần dùng.
