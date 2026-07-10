export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>booking-admin (standalone)</h1>
      <p>App này có thể chạy độc lập, hoặc bị resto nhúng qua Module Federation.</p>
      <ul>
        <li><a href="/booking/reservations">Đặt bàn (standalone)</a></li>
        <li><a href="/booking/tables">Sơ đồ bàn (standalone)</a></li>
      </ul>
    </div>
  );
}
