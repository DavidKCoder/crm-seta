"use client";

import { useEffect, useState } from "react";

export default function ThemeSwitch() {
    const [theme, setTheme] = useState("light");

    const isDark = theme === "dark";

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
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
