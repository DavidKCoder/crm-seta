"use client";

import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";

const languages = [
    { code: "hy", label: "Հայ", country: "AM" },
    { code: "ru", label: "Ру", country: "RU" },
    { code: "en", label: "EN", country: "GB" },
];

export default function LanguageSwitcher({ collapsed }) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    if (!i18n) return null;

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex justify-between items-center border rounded px-3 py-2 text-gray-800 bg-gray-100 hover:bg-gray-100 transition cursor-pointer"
            >
                <span className="flex items-center gap-2">
                  <ReactCountryFlag countryCode={currentLang.country} svg />
                    {!collapsed && currentLang.label}
                </span>
                {!collapsed && <IoMdArrowDropdown />}
            </button>

            {open && (
                <ul className="w-24 absolute bottom-14 left-1 bg-white border rounded shadow-md z-50">
                    {languages.map(lang => (
                        <li
                            key={lang.code}
                            className="px-3 py-2 hover:bg-purple-100 dark:text-gray-800 cursor-pointer flex items-center gap-2"
                            onClick={() => handleSelect(lang.code)}
                        >
                            <ReactCountryFlag countryCode={lang.country} svg /> {lang.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
