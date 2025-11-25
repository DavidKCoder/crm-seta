"use client";

import { FiX } from "react-icons/fi";

export default function PackageModal({
                                         t,
                                         modalOpen,
                                         setModalOpen,
                                         editId,
                                         form,
                                         setForm,
                                         handleSubmit,
                                         isSaving = false,
                                         currencyOptions = [],
                                     }) {
    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {editId ? t("EditPackage") : t("AddPackage")}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Name")}</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Description")}</label>
                        <textarea
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">{t("Price")}</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-sm font-medium mb-1">{t("Currency")}</label>
                            <select
                                value={form.currency}
                                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                className="border rounded p-2 w-full"
                            >
                                {currencyOptions.map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                        disabled={isSaving}
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer disabled:opacity-60"
                        disabled={isSaving}
                    >
                        {isSaving ? t("Saving...") : editId ? t("Save") : t("Add")}
                    </button>
                </div>
            </div>
        </div>
    );
}
