import { Geist, Lato } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import ThemeSwitch from "@/components/ThemeSwitch";

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
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 light flex flex-col bg-gray-100">
                <div className="flex justify-end items-center mb-4 rounded-lg bg-purple-50 p-1.5">
                    <div className="flex items-center gap-2">
                        <ThemeSwitch />
                        <IoSettingsOutline size={22} className="text-gray-900"/>
                        <IoNotificationsOutline size={22} className="text-gray-900" />
                        <Image
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <div className="grid items-center">
                            <span className="mr-2 text-gray-700 font-medium text-sm">{currentUser.name}</span>
                            <span className="mr-2 text-gray-700 font-medium text-[10px]">{currentUser.role}</span>
                        </div>
                    </div>
                </div>
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}
