import { useState } from "react";
import { getStatusColor } from "@/constants/colors/statusColors";
import { useTranslation } from "react-i18next";

export default function DealDropdown({ dealsList, formState, setFormState }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleSelect = (dealId) => {
        setFormState({ ...formState, dealId });
        setOpen(false);
    };

    const selectedDeal = dealsList.find(d => d.id === formState.dealId);

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full border rounded px-3 py-2 flex justify-between items-center text-left bg-white"
            >
                {selectedDeal
                    ? <span className="flex items-center gap-2">
                        <span>{`#${selectedDeal.id} ${selectedDeal.name}`}</span>
                        <span
                            className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedDeal.status)}`}>
                            {selectedDeal.status}
                        </span>
                      </span>
                    : t("Select a deal")}
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
                            <span>{`#${deal.id} ${deal.name}`}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(deal.status)}`}>
                                {deal.status}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
