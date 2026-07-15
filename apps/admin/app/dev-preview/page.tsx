import Link from "next/link";

const MODULE_KEYS = ["bookings", "bookings-new", "waitlist", "time-slots", "tables", "layout", "settings"];

export default function DevPreviewIndexPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-semibold">Dev preview — containers/*</h1>
      <p className="mb-4 text-sm text-admin-ink/60">
        Render trực tiếp container với props giả lập, không qua Module Federation. Thêm query
        <code className="mx-1">?tenantId=&locale=&parentPage=&permissions=a,b,c</code> để đổi giá trị mock.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {MODULE_KEYS.map((key) => (
          <li key={key}>
            <Link className="text-blue-600 underline" href={`/dev-preview/${key}`}>
              {key}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
