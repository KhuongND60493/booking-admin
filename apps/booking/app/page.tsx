export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">SkyBooking</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <a className="text-primary underline" href="/demo-tenant">
            /demo-tenant
          </a>{" "}
          — trang storefront render JSON đã publish
        </li>
      </ul>
    </div>
  );
}
