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
                                     }) {
    if (!modalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                {/* Close button */}
                <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {editId ? t("EditPackage") : t("AddPackage")}
                </h2>

                <div className="space-y-3">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Title")}</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    {/* Price (only digits) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("Price")}</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={form.price}
                            onChange={(e) =>
                                setForm({ ...form, price: e.target.value.replace(/\D/g, "") })
                            }
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    {/* Services */}
                    <div>
                        <label className="block text-sm font-medium mb-1">{t("ServicesComma")}</label>
                        <textarea
                            rows={3}
                            value={form.services}
                            onChange={(e) => setForm({ ...form, services: e.target.value })}
                            className="border rounded p-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
                    >
                        {editId ? t("Save") : t("Add")}
                    </button>
                </div>
            </div>
        </div>
    );
}
