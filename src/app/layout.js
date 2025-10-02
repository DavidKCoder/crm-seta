import { Geist, Lato } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { IoNotificationsOutline } from "react-icons/io5";
import ThemeSwitch from "@/components/ThemeSwitch";
import { HeadIconButton } from "@/components/HeaderIconButton";
import I18nProvider from "@/components/I18nProvider";

const USER_ROLE = process.env.NEXT_PUBLIC_CURRENT_USER;

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const lato = Lato({ weight: "400", variable: "--font-lato", subsets: ["latin"] });

export const metadata = {
    title: "SETA CRM",
    description: "Simple CRM prototype",
};

const currentUser = { name: "John R.", role: USER_ROLE, avatar: "https://i.pravatar.cc/32?img=14" };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${lato.variable}`}>
        <I18nProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-4 light flex flex-col bg-gray-100">
                    <div className="flex justify-end items-center mb-4 rounded-lg bg-purple-50 p-1.5">
                        <div className="flex items-stretch gap-2">
                            <ThemeSwitch />

                            <div className="flex gap-2">
                                {/*<HeadIconButton icon={IoSettingsOutline} />*/}
                                <HeadIconButton icon={IoNotificationsOutline} badge={5} />
                            </div>
                            <div
                                className="flex items-center h-10 rounded-md border border-transparent text-sm text-white transition-all shadow-sm hover:shadow-lg cursor-pointer">
                                <div className="flex items-center gap-2 px-3">
                                    <Image
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <div className="grid leading-tight">
                                        <span className="text-gray-700 font-medium text-sm">{currentUser.name}</span>
                                        <span className="text-gray-500 text-[10px]">{currentUser.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {children}
                </main>
            </div>
        </I18nProvider>
        </body>
        </html>
    );
}
