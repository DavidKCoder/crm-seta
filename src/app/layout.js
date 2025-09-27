// "use client" убрано
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const lato = Lato({ weight: "400", variable: "--font-lato", subsets: ["latin"] });

export const metadata = {
    title: "CRM",
    description: "Simple CRM prototype",
};

const currentUser = { name: "John R.", role: "Manager", avatar: "https://i.pravatar.cc/32?img=14" };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${lato.variable}`}>
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 light flex flex-col">
                <div className="flex justify-between items-center mb-2 rounded-lg bg-purple-50 p-1.5">
                    <div className="relative w-1/2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full border rounded-md pl-10 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
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
