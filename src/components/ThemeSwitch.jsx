"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitch() {
    const [theme, setTheme] = useState("light");

    const isDark = theme === "dark";

    useEffect(() => {
        // Initialize from localStorage on mount
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem("crm-theme") : null;
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        if (typeof window !== "undefined") {
            localStorage.setItem("crm-theme", theme);
        }
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-3 py-1 border rounded text-black cursor-pointer ${isDark ? "bg-slate-700" : ""}`}
        >
            {isDark ? "☀️" : "🌙"}
        </button>
    );
}
