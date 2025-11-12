import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDealStatuses } from "@/components/DealStatusesProvider";

export function StatusDropdown({ statuses, selectedStatuses, toggleStatus, setSelectedStatuses }) {
    const { t } = useTranslation();
    const { getStatusStyle } = useDealStatuses();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allSelected = selectedStatuses.length === statuses.length;

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedStatuses([]);
        } else {
            setSelectedStatuses(statuses);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm cursor-pointer"
            >
                <span className="text-sm text-gray-700">
                    {selectedStatuses.length > 0
                        ? `${selectedStatuses.length} ${t("selected")}`
                        : t("Select statuses")}
                </span>

                <ChevronDown size={16} />
            </button>

            {open && (
                <div
                    className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
                >
                    {/* Select All / Deselect All */}
                    <label
                        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm border-b"
                    >
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={handleSelectAll}
                            className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                        />
                        <span className="font-medium text-gray-800">
                            {allSelected ? t("Deselect All") : t("Select All")}
                        </span>
                    </label>

                    {statuses.map((st, i) => (
                        <label
                            key={i}
                            className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-gray-50 text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes(st)}
                                onChange={() => toggleStatus(st)}
                                className={`w-4 h-4 rounded border border-gray-300 accent-gray-100 cursor-pointer ${getStatusStyle(st)}`}
                            />
                            <span className={`px-2 py-0.5 rounded-md ${getStatusStyle(st)}`}>
                                {st}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
