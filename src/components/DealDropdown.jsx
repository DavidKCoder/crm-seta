import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function DealDropdown({ dealsList, formState, setFormState }) {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const handleSelect = (dealId) => {
        setFormState({ ...formState, dealId });
        setOpen(false);
    };

    const selectedDeal = dealsList.find(d => d.id === formState.dealId);

    // Helper function to safely get status name
    const getStatusName = (status) => {
        if (!status) return "";
        return typeof status === "string" ? status : status.name || "";
    };

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full border rounded px-3 py-2 flex justify-between items-center text-left bg-white"
            >
                {selectedDeal ? (
                    <span className="flex items-center gap-2">
                        <span className="border rounded p-1 bg-purple-100 text-xs">
                            {`#${String(selectedDeal.id).slice(0, 4)}`}
                        </span>
                        <span>{`${selectedDeal.name}`}</span>
                        {selectedDeal.status && (
                            <span
                                className="px-2 py-0.5 rounded text-xs"
                                style={{
                                    backgroundColor: selectedDeal.status.colorHex ? `${selectedDeal.status.colorHex}20` : "transparent",
                                    color: selectedDeal.status.colorHex || "inherit",
                                }}
                            >
                                {getStatusName(selectedDeal.status)}
                            </span>
                        )}
                    </span>
                ) : (
                    t("Select a deal")
                )}
                <span className="ml-2">&#9662;</span>
            </button>

            {open && (
                <ul className="absolute z-50 w-full max-h-60 overflow-auto border rounded mt-1 bg-white shadow-lg">
                    {dealsList.map(deal => (
                        <li
                            key={deal.id}
                            onClick={() => handleSelect(deal.id)}
                            className="px-3 py-2 cursor-pointer hover:bg-purple-100 flex justify-between items-center"
                        >
                            <div>
                                <span className="border rounded p-1 mr-2 bg-purple-100 text-xs">
                                    {`#${String(deal.id).slice(0, 4)}`}
                                </span>
                                <span>{deal.name}</span>
                            </div>
                            {deal.status && (
                                <span
                                    className="px-2 py-0.5 rounded text-sm"
                                    style={{
                                        backgroundColor: deal.status.colorHex ? `${deal.status.colorHex}20` : "transparent",
                                        color: deal.status.colorHex || "inherit",
                                    }}
                                >
                                    {getStatusName(deal.status)}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}