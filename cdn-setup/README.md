# cdn-setup — giả lập CDN cục bộ cho booking-admin (Windows)

Bộ file này dùng để biến 1 máy Windows (vd "máy 104") thành nơi serve static file của
booking-admin qua HTTP, thay cho Vercel — phục vụ test nhanh, không cần deploy mỗi lần đổi
code.

## 1. Copy cả folder này sang máy Windows

Copy toàn bộ thư mục `cdn-setup/` (không chỉ file bên trong) sang máy 104, đặt ở đâu cũng
được, ví dụ `C:\cdn-local\`.

Sau khi copy, cấu trúc trên máy 104 sẽ là:

```
C:\cdn-local\
├── config.bat
├── start-cdn.bat
├── .gitignore          (không ảnh hưởng gì trên Windows, có thể xoá nếu muốn)
└── booking-admin\       ← copy nội dung build vào đây (xem bước 3)
```

Nếu sau này có thêm service khác dùng chung máy này, tạo thêm 1 thư mục con ngang hàng
`booking-admin\`, ví dụ `C:\cdn-local\inventory-admin\` — không cần sửa `start-cdn.bat`.

## 2. Cài Node.js trên máy 104 (nếu chưa có)

Mở Command Prompt, chạy:

```
node -v
```

Nếu hiện version (vd `v20.x`) → đã sẵn sàng, bỏ qua bước này.
Nếu báo lỗi "not recognized" → tải Node.js LTS tại https://nodejs.org, cài đặt mặc định.

## 3. Build booking-admin và copy vào đây

Trên máy dev (không phải máy 104):

```bash
cd booking-admin
pnpm build
```

Copy **toàn bộ nội dung bên trong** thư mục `out/` (không phải chính thư mục `out/`) vào
`C:\cdn-local\booking-admin\` trên máy 104 — qua chia sẻ mạng, SCP, USB, hay công cụ đồng bộ
bất kỳ.

Sau khi copy xong, phải thấy các file này tồn tại:
- `C:\cdn-local\booking-admin\registry.json`
- `C:\cdn-local\booking-admin\_next\static\chunks\remoteEntry.<version>.js`

Mỗi lần muốn test bản build mới: build lại, copy đè lên thư mục cũ là xong — không cần đổi
gì khác.

## 4. Đổi port publish (mặc định 8100)

Mở `config.bat`, sửa dòng:

```bat
set PORT=8100
```

thành port bạn muốn, rồi lưu lại.

**Hoặc** không cần sửa file — chạy trực tiếp với port khác:

```
start-cdn.bat 9000
```

(port truyền vào dòng lệnh sẽ override giá trị trong `config.bat` cho lần chạy đó).

## 5. Mở port trên Windows Firewall

Đây là bước hay bị bỏ sót nhất — server chạy được trên chính máy 104 nhưng máy khác trong
mạng không gọi vào được.

Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule → Port → TCP →
nhập đúng port đang dùng (mặc định 8100, hoặc port bạn đã đổi ở bước 4) → Allow the
connection → áp dụng cho Private network (hoặc Domain, tuỳ mạng nội bộ đang dùng) → đặt tên
rule tuỳ ý (vd "booking-admin cdn-setup") → Finish.

## 6. Chạy server

Double-click `start-cdn.bat` (hoặc mở Command Prompt tại thư mục này rồi chạy
`start-cdn.bat` để thấy log trực tiếp).

Giữ cửa sổ này mở trong lúc test — đóng lại là server dừng.

## 7. Kiểm tra

Từ máy 104 hoặc máy khác cùng mạng, mở trình duyệt hoặc `curl`:

```
http://<ip-máy-104>:<port>/booking-admin/registry.json
http://<ip-máy-104>:<port>/booking-admin/_next/static/chunks/remoteEntry.<version>.js
```

`registry.json` phải trả đúng JSON, và response header phải có
`access-control-allow-origin: *` (flag `--cors` trong `start-cdn.bat` đã tự lo việc này).

Nếu gọi được từ chính máy 104 nhưng không gọi được từ máy khác → quay lại bước 5 (firewall).

## 8. Trỏ resto (skyresto-webman) sang máy 104

Trên máy chạy resto, tạo/sửa file `.env.local` (file này **không commit vào git**), thêm:

```
BOOKING_ADMIN_URL=http://<ip-máy-104>:<port>/booking-admin
```

Chạy `pnpm dev` — resto phải chạy **HTTP** (`http://localhost:3000`), không phải HTTPS, nếu
không trình duyệt sẽ chặn mixed-content vì máy 104 chỉ serve HTTP.

Vào `/booking/list`, `/booking/waitlist`, `/booking/layout` — kiểm tra Network tab thấy
request đi tới `http://<ip-máy-104>:<port>/...` thay vì `booking-admin-indol.vercel.app`.

## 9. Dọn dẹp sau khi test xong

Xoá hoặc comment dòng `BOOKING_ADMIN_URL` trong `.env.local` → resto tự động quay lại dùng
Vercel, không cần đổi gì khác. Có thể tắt cửa sổ `start-cdn.bat` trên máy 104 nếu không cần
nữa.
