import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import { AdminSidebar } from "./components/AdminSidebar";
import { AntdProvider } from "./components/AntdProvider";
import { AdminQueryProviderWithI18n } from "./components/AdminQueryProviderWithI18n";
import { I18nProvider } from "./i18n/I18nProvider";
import { fallbackLng } from "./i18n/settings";

const newsreader = Newsreader({
  subsets: ["latin", "vietnamese"],
  variable: "--font-newsreader",
});
const publicSans = Public_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-public-sans",
});

export const metadata = {
  title: "SkyBooking Admin",
  description: "Admin builder cho SkyBooking Webman (Puck SDUI)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={fallbackLng}
      className={`${newsreader.variable} ${publicSans.variable}`}
    >
      <body>
        <I18nProvider lng={fallbackLng}>
          <AntdProvider>
            <AdminQueryProviderWithI18n>
              <div className="flex h-screen bg-admin-bg">
                <AdminSidebar />
                <div className="flex-1 overflow-y-auto min-w-0">{children}</div>
              </div>
            </AdminQueryProviderWithI18n>
          </AntdProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
