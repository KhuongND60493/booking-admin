import { Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import { AdminSidebar } from "./components/AdminSidebar";
import { AntdProvider } from "./components/AntdProvider";
import { I18nProvider } from "./i18n/I18nProvider";
import { fallbackLng } from "./i18n/settings";
import { AdminQueryProvider } from "@skybooking/hooks/admin";

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
        <AdminQueryProvider>
            <I18nProvider lng={fallbackLng}>
                <div className="flex h-screen bg-admin-bg">
                    <AdminSidebar />
                    <div className="flex-1 overflow-y-auto min-w-0">
                        <AntdProvider>{children}</AntdProvider>
                    </div>
                </div>
            </I18nProvider>
        </AdminQueryProvider>
        </body>
        </html>
    );
}
