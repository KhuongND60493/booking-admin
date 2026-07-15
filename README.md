# skybooking-webman

Turborepo monorepo cho nền tảng đặt bàn nhà hàng đa thương hiệu (F&B), dùng Puck
(`@measured/puck`) làm page-builder theo mô hình Server-Driven UI (SDUI). Admin
tuỳ chỉnh layout + theme từng trang qua builder kéo-thả mà không cần code; app
khách hàng render đúng theo config đã publish.

Gồm 2 app độc lập:

- **`apps/booking`** — app khách hàng: duyệt nhà hàng, đặt bàn, xác thực OTP, waitlist.
- **`apps/admin`** — app quản trị: quản lý booking/waitlist, tạo booking thay khách,
  chỉnh sửa layout + theme cho từng trang của `apps/booking`.

## Chạy dự án

```bash
yarn install

# Copy env mẫu cho từng app (để trống NEXT_PUBLIC_BE_API_URL nếu chưa có BE thật —
# hệ thống tự fallback về mock/file JSON local)
cp apps/booking/.env.local.example apps/booking/.env.local
cp apps/admin/.env.local.example apps/admin/.env.local

yarn dev   # chạy turbo dev — cả 2 app cùng lúc
```

- `apps/booking` mặc định port **3000**
- `apps/admin` mặc định port **3001**

Mở thử:
- `http://localhost:3000/demo-tenant` — trang chủ khách hàng (danh sách nhà hàng)
- `http://localhost:3001/bookings` — admin: danh sách booking

```bash
yarn build   # turbo build cho cả 2 app
yarn lint    # turbo lint
```

## Cấu trúc monorepo

```
apps/
  booking/                       <- App khách hàng (Next.js 14 App Router)
    app/[tenant]/                   Trang chủ — chọn nhà hàng theo tenant
    app/[tenant]/[storeId]/         Store Detail — chọn ngày/giờ/số khách
    app/[tenant]/[storeId]/tables/  Table Selection — chọn bàn theo khu vực
    app/[tenant]/[storeId]/info/    Customer Info — thông tin liên hệ
    app/[tenant]/[storeId]/otp/     OTP — xác thực + tạo booking thật
    app/[tenant]/[storeId]/success/ Success — xác nhận đặt bàn thành công
    app/[tenant]/[storeId]/waitlist/Waitlist — đăng ký chờ bàn khi hết chỗ
    app/actions.ts                  Server Action: load theme/config, tạo booking, waitlist
    app/BookingPageShell.tsx        Client wrapper: set theme runtime + BookingContext

  admin/                         <- App quản trị (Next.js 14 App Router)
    app/bookings/                   Danh sách booking (KPI + filter + bảng)
    app/bookings/new/               Wizard 4 bước tạo booking thay khách (không OTP)
    app/waitlist/                   Danh sách chờ + Convert → booking thật
    app/edit-layout/                Chọn 1 trong 7 trang để chỉnh layout (Puck builder)
    app/edit-layout/theme/          Cấu hình theme (màu + font) cho store
    app/components/AdminSidebar.tsx Sidebar 4 menu cố định
    app/actions.ts                  Server Action dùng chung cho toàn bộ admin

packages/
  ui/               <- Component UI theo trang, chia nhỏ theo khối (không phải 1 khối lớn)
    home/              PageHeader1, BrandFilterBar1, StoreList1
    store-detail/      StoreHeader1, DateTimePartyForm1
    table-selection/   ZoneTabs1, TableGridBody1, TableSelectionSummary1
    customer-info/     ContactInfoForm1
    otp/               OtpHeader1, OtpCodeInput1
    success/           SuccessHeader1, SuccessActions1
    waitlist/          WaitlistIntro1, WaitlistFormFields1, WaitlistDone1
    shared/            BookingSummaryCard1 (dùng chung Customer Info + Success)

  hooks/            <- Business logic — component KHÔNG tự viết state/gọi API
    BookingContext.tsx        Context toàn cục: tenant/storeId/baseUrl + Server Action
    StoreListContext.tsx      Context cấp trang (Home) — share state filter + danh sách
    TableSelectionContext.tsx Context cấp trang (Table Selection) — share state chọn bàn/zone
    usePageTheme.ts           Set CSS variable runtime từ StoreTheme (không hardcode theme)
    use*.ts                   1 hook / luồng nghiệp vụ (useStoreList, useOtpVerification, ...)
    bookingDraft.ts           Lưu state tạm giữa các trang qua sessionStorage

  puck-config/      <- Registry Puck THEO TỪNG TRANG (không phải 1 registry global)
    pages/*.config.tsx  7 file, mỗi file = registry riêng của 1 trang
    index.ts            pageConfigs map, getConfigForPage(), toPuckData()

  api-client/       <- Gọi BE thật qua fetch(), fallback file JSON khi BE lỗi/chưa có
    index.ts          Entry CLIENT-SAFE (không dùng fs) — searchTables, getMenu, listStores, OTP...
    server.ts         Entry SERVER-ONLY (dùng fs) — getPageConfig, getStoreTheme, Booking/Waitlist CRUD
    data/             Fallback mock data (gitignored nội dung runtime, giữ cấu trúc)
```

## Nguyên tắc cốt lõi

- **Mỗi trang chia thành nhiều component con theo khối UI**, không gộp thành 1 khối lớn —
  admin chọn/sắp xếp từng khối độc lập trong Puck builder.
- **Component chỉ lo layout/JSX, không tự viết state hay gọi API.** Logic nghiệp vụ nằm
  trong custom hook (`packages/hooks`) dùng chung theo nhóm chức năng.
- **Component con cùng 1 trang cần chia sẻ state tương tác** (vd chọn brand filter ảnh
  hưởng danh sách store) dùng **context cấp trang** (`StoreListProvider`,
  `TableSelectionProvider`) — khác với `BookingContext` toàn cục (tenant/storeId/baseUrl).
- **JSON từ Puck chỉ chứa `type` + `props`**, không bao giờ chứa logic thực thi — đây là
  ranh giới bảo mật cốt lõi (registry theo trang là whitelist).
- **Theme (màu + font) không hardcode** — toàn bộ đến từ `StoreTheme` (cấp Store), admin
  cấu hình qua `/edit-layout/theme`, áp dụng runtime qua `usePageTheme` (set CSS variable
  `--color-primary`, `--font-heading`, ...).
- **Responsive mobile + desktop** (`md:`/`lg:`) cho mọi component, không có breakpoint tablet riêng.
- **Ranh giới client/server trong `@skybooking/api-client`**: code dùng `fs` (đọc/ghi fallback
  file) chỉ export qua `./server`, không lọt vào bundle client. Client component cần gọi
  code này phải đi qua Server Action riêng của từng app (`apps/*/app/actions.ts`).
- **Đa nhà hàng trong 1 tenant**: khách chọn nhà hàng cụ thể (`storeId`) ở Trang chủ trước
  khi vào luồng đặt bàn — route dạng `[tenant]/[storeId]/...`.

## BE thật / mock fallback

BE thật (nếu có) nằm ở project/service khác — 2 app chỉ gọi API qua `@skybooking/api-client`
với base URL cấu hình riêng từng app (`NEXT_PUBLIC_BE_API_URL` trong `.env.local`). Khi BE
lỗi hoặc chưa cấu hình, hệ thống tự fallback về mock data / file JSON local
(`packages/api-client/data/`) — không lỗi cứng, phù hợp cho demo/dev.
