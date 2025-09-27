"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../public/seta_logo.PNG";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/tasks", label: "Tasks" },
        { href: "/clients", label: "Clients" },
        { href: "/leads", label: "Leads" },
        { href: "/deals", label: "Deals" },
        { href: "/quotes", label: "Quotes" },
        { href: "/packages", label: "Packages" },
        { href: "/statistics", label: "Statistics" },
    ];

    return (
        <div className="min-w-48 bg-[#0d042d] text-white shadow-md p-4 h-auto min-h-screen rounded-r-2xl">
            <div className="flex items-center mb-6">
                <Image
                    src={logo}
                    alt="logo"
                    className="rounded-full"
                    width={60}
                    height={60}
                />
                <h1 className="text-2xl font-bold ml-3">CRM</h1>
            </div>

            <ul className="space-y-4">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`block hover:text-[#4F47A5] ${
                                pathname === link.href ? "text-[#4F47A5] font-bold" : "text-white"
                            }`}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
