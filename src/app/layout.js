import { Geist, Lato } from "next/font/google";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";
import { DealStatusesProvider } from "@/components/DealStatusesProvider";
import AppShell from "@/components/AppShell";
import { RolesProvider } from "@/components/RolesProvider";
import ReduxProvider from "@/components/ReduxProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const lato = Lato({ weight: "400", variable: "--font-lato", subsets: ["latin"] });

export const metadata = {
    title: "SETA CRM",
    description: "Simple CRM prototype",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${lato.variable}`}>
        <ReduxProvider>
        <I18nProvider>
        <RolesProvider>
            <DealStatusesProvider>
                <AppShell>
                    {children}
                </AppShell>
            </DealStatusesProvider>
        </RolesProvider>
        </I18nProvider>
        </ReduxProvider>
        </body>
        </html>
    );
}
