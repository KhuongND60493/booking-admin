import "./globals.css";
import { QueryProvider } from "@skybooking/hooks";

export const metadata = {
  title: "SkyBooking",
  description: "Multi-tenant restaurant booking SDUI demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
