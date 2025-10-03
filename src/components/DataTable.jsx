"use client";

import React, { useState, useMemo } from "react";
import { FiEdit2, FiInbox, FiMail, FiTrash } from "react-icons/fi";
import { BiArrowToTop, BiArrowFromTop } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

import FormModal from "@/components/FormModal";
import ExpenseFormModal from "@/components/ExpenseFormModal"; // отдельный модал для расходов
import Alert from "@/components/Alert";
import { dealsData } from "@/constants";
import { getStatusColor } from "@/constants/colors/statusColors";
import { FaFacebookF, FaGlobe, FaInstagram } from "react-icons/fa";
import { TbCurrencyDram } from "react-icons/tb";

export default function DataTable({ initialData, columns, title }) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [data, setData] = useState(initialData);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formState, setFormState] = useState({});
    const [filter, setFilter] = useState("");
    const [alert, setAlert] = useState({ show: false, type: "success", message: "" });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const requestSort = (key) => {
        if (sortConfig.key === key) {
            setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
        } else {
            setSortConfig({ key, direction: "asc" });
        }
    };

    const filteredData = useMemo(() => {
        if (!filter.trim()) return data;
        return data.filter(item =>
            Object.values(item).some(val =>
                val?.toString().toLowerCase().includes(filter.toLowerCase()),
            ),
        );
    }, [data, filter]);

    const sortedData = useMemo(() => {
        const sorted = [...filteredData];
        if (!sortConfig.key) return sorted;

        sorted.sort((a, b) => {
            let aValue = a[sortConfig.key] || "";
            let bValue = b[sortConfig.key] || "";
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormState({ ...item });
        setShowForm(true);
    };

    const handleSave = () => {
        if (editingId) {
            setData(data.map(d => d.id === editingId ? { ...formState } : d));
        } else {
            const id = Math.floor(Math.random() * 100000);
            setData([...data, { id, ...formState }]);
        }
        setFormState({});
        setEditingId(null);
        setShowForm(false);

        setAlert({ show: true, type: "success", message: t("Data saved successfully!") });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const totals = useMemo(() => {
        if (pathname !== "/expenses") return {};
        return {
            salesManager: sortedData.reduce((sum, item) => sum + (item.salesManager || 0), 0),
            copyWriter: sortedData.reduce((sum, item) => sum + (item.copyWriter || 0), 0),
            designer: sortedData.reduce((sum, item) => sum + (item.designer || 0), 0),
            targeting: sortedData.reduce((sum, item) => sum + (item.targeting || 0), 0),
            shooting: sortedData.reduce((sum, item) => sum + (item.shooting || 0), 0),
            total: sortedData.reduce((sum, item) => sum + (item.total || 0), 0),
        };
    }, [data, pathname, sortedData]);

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl text-gray-900 font-bold">{t(title)}</h1>
                    <input
                        type="text"
                        placeholder={`${t("Search")}...`}
                        value={filter}
                        onChange={e => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border p-2 rounded w-64 pr-8 text-gray-900 border-gray-800"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setFormState({});
                        }}
                    >
                        {t("Add")}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={`p-3 ${col.sortable !== false ? "cursor-pointer select-none" : ""}`}
                                onClick={() => col.sortable !== false && requestSort(col.key)}
                            >
                                <div className="flex items-center gap-1">
                                    {t(col.label)}
                                    {sortConfig.key === col.key && (
                                        sortConfig.direction === "asc" ? <BiArrowToTop /> : <BiArrowFromTop />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length ? paginatedData.map(item => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                            {columns.map(col => (
                                <td key={col.key} className="p-3 text-gray-900">
                                    {col.key === "status" ? (
                                        <span
                                            className={`py-1 px-3 rounded-md font-medium text-sm ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    ) : col.key === "social" ? (
                                        <div className="flex gap-2">
                                            {item.facebook && (
                                                <a href={item.facebook} target="_blank" rel="noopener noreferrer"
                                                   className="text-gray-500 hover:text-purple-800 bg-gray-100 p-2 rounded-full">
                                                    <FaFacebookF size={16} />
                                                </a>
                                            )}
                                            {item.instagram && (
                                                <a href={item.instagram} target="_blank" rel="noopener noreferrer"
                                                   className="text-gray-500 hover:text-purple-800 bg-gray-100 p-2 rounded-full">
                                                    <FaInstagram size={16} />
                                                </a>
                                            )}
                                            {item.website && (
                                                <a href={item.website} target="_blank" rel="noopener noreferrer"
                                                   className="text-gray-500 hover:text-purple-800 bg-gray-100 p-2 rounded-full">
                                                    <FaGlobe size={16} />
                                                </a>
                                            )}
                                        </div>
                                    ) : col.key === "action" ? (
                                        <div className="flex gap-3 text-gray-500">
                                            <FiMail
                                                className="cursor-pointer hover:text-purple-600"
                                                onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${item.email}`, "_blank")}
                                            />
                                            <FiEdit2
                                                className="cursor-pointer hover:text-blue-600"
                                                onClick={() => handleEdit(item)}
                                            />
                                            <FiTrash
                                                className="cursor-pointer hover:text-red-600"
                                                onClick={() => setData(data.filter(d => d.id !== item.id))}
                                            />
                                        </div>
                                    ) : (
                                        item[col.key]
                                    )}
                                </td>
                            ))}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={columns.length}>
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400 h-fit">
                                    <FiInbox size={40} className="mb-3" />
                                    <span>{t("No data available")}</span>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>

                    {/*Footer с totals только на /expenses*/}
                    {pathname === "/expenses" && (
                        <tfoot className="bg-gray-100 font-semibold text-gray-700">
                        <tr>
                            <td className="p-3">{t("Total")}</td>
                            {["salesManager", "copyWriter", "designer", "targeting", "shooting"].map(key => (
                                <td key={key} className="p-3">
                                    <div className="flex items-center gap-0.5">
                                        {totals[key]}
                                        <TbCurrencyDram />
                                    </div>
                                </td>
                            ))}
                            <td className="p-3" />
                            <td className="p-3">
                                <div className="flex items-center gap-0.5">
                                    {totals.total}
                                    <TbCurrencyDram />
                                </div>
                            </td>
                            <td className="p-3" />
                        </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex justify-between items-center mt-4 text-gray-700">
                    <div className="flex items-center gap-2">
                        <span>{t("Rows per page")}:</span>
                        <select
                            value={itemsPerPage}
                            onChange={e => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border rounded p-1"
                        >
                            {[5, 10, 20, 50].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-purple-600 hover:text-white cursor-pointer"
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            {t("Prev")}
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-purple-600 text-white" : ""} hover:bg-purple-600 hover:text-white cursor-pointer`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-purple-600 hover:text-white cursor-pointer"
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            {t("Next")}
                        </button>
                    </div>
                </div>
            )}

            {alert.show && (
                <div className="absolute bottom-2 right-2">
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                </div>
            )}

            {/* Modal */}
            {showForm && (
                pathname === "/expenses" ? (
                    <ExpenseFormModal
                        show={showForm}
                        title={title}
                        onClose={() => setShowForm(false)}
                        onSave={handleSave}
                        formState={formState}
                        setFormState={setFormState}
                        editingId={editingId}
                        dealsList={dealsData}
                    />
                ) : (
                    <FormModal
                        show={showForm}
                        title={title}
                        onClose={() => setShowForm(false)}
                        onSave={handleSave}
                        formState={formState}
                        setFormState={setFormState}
                        editingId={editingId}
                    />
                )
            )}
        </div>
    );
}
