export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>booking-admin (standalone)</h1>
      <p>App này có thể chạy độc lập, hoặc bị resto nhúng qua Module Federation.</p>
      <ul>
        <li><a href="/bookings">Danh sách booking (standalone)</a></li>
        <li><a href="/waitlist">Waitlist (standalone)</a></li>
        <li><a href="/edit-layout">Chỉnh sửa layout booking (standalone)</a></li>

          <li><a href="/bookings">Khung gio</a></li>
          <li><a href="/waitlist">Ban</a></li>
          <li><a href="/edit-layout">Cau hinh</a></li>
      </ul>
    </div>
  );
}
