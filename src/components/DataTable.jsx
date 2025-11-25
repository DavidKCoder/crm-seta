"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiInbox, FiMail, FiTrash } from "react-icons/fi";
import { BiArrowFromTop, BiArrowToTop } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import FormModal from "@/components/FormModal";
import ExpenseFormModal from "@/components/ExpenseFormModal";
import Alert from "@/components/Alert";
// Remove hardcoded dealsData import as we'll use props
import { useDealStatuses } from "@/components/DealStatusesProvider";
import { deleteClient } from "@/features/clients/clientsSlice";
import { deleteCampaign } from "@/features/campaigns/campaignsSlice";
import { FaFacebookF, FaGlobe, FaInstagram } from "react-icons/fa";
import { TbCurrencyDram } from "react-icons/tb";
import { DealAvatar } from "@/app/deals/components/DealAvatar";

const TruncatedText = ({ text, maxLength = 30 }) => {
    if (!text) return "";
    const str = String(text);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

export default function DataTable({
                                      initialData,
                                      columns,
                                      title,
                                      dealsList = [],
                                      onSave,
                                      onDelete,
                                      roles = [],
                                      users = [],
                                  }) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const dispatch = useDispatch();
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

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

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

    const handleSave = async (formDataFromModal) => {
        // For /expenses route, delegate to parent onSave with payload from ExpenseFormModal
        if (pathname === "/expenses" && typeof onSave === "function") {
            const payload = formDataFromModal || formState;
            const success = await onSave(payload);
            if (success) {
                setFormState({});
                setEditingId(null);
                setShowForm(false);
                setAlert({ show: true, type: "success", message: t("Data saved successfully!") });
                setTimeout(() => setAlert({ ...alert, show: false }), 3000);
            }
            return;
        }

        // Default in-memory behaviour for other routes
        if (editingId) {
            setData(data.map(d => d.id === editingId ? { ...formState } : d));
        } else {
            const id = Math.floor(Math.random() * 100000);
            setData([{ id, ...formState }, ...data]);
        }
        setFormState({});
        setEditingId(null);
        setShowForm(false);

        setAlert({ show: true, type: "success", message: t("Data saved successfully!") });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const totals = useMemo(() => {
        if (pathname !== "/expenses") return {};

        const result = {};

        columns.forEach(col => {
            if (col.key === "dealId" || col.key === "action" || col.key === "other") {
                return;
            }

            if (sortedData.some(item => typeof item[col.key] === "number")) {
                result[col.key] = sortedData.reduce((sum, item) => sum + (Number(item[col.key]) || 0), 0);
            }
        });

        return result;
    }, [data, pathname, sortedData, columns]);

    const numericColumns = useMemo(() => {
        return columns.filter(col => {
            if (col.key === "dealId" || col.key === "action" || col.key === "other") {
                return false;
            }
            return sortedData.some(item => typeof item[col.key] === "number");
        });
    }, [columns, sortedData]);

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
                            // For expenses, initialise form state with expected structure
                            if (pathname === "/expenses") {
                                setFormState({
                                    dealId: "",
                                    items: [{ userId: "", roleId: "", amount: "" }],
                                    notes: "",
                                    assignedToUserIds: [],
                                });
                            } else {
                                setFormState({});
                            }
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
                            {columns.map(col => {
                                col.key === "assignedUsersDisplay" && console.log("col", item?.assignedUsers);
                                return (
                                    <td key={col.key} className="p-3 text-gray-900">
                                        {col.key === "assignedUsersDisplay" ? (
                                                <div className="flex -space-x-4 rtl:space-x-reverse">
                                                    {(() => {
                                                        return item?.assignedUsers?.map((user) => {
                                                            return (
                                                                <div key={user.id}>
                                                                    <DealAvatar deal={user} />
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            )
                                            : col.key === "status" ? (
                                                (() => {
                                                    const statusName = item.status?.name || item.status;
                                                    const colorHex = item.status?.colorHex;

                                                    return (
                                                        <span
                                                            className={`py-1 px-3 rounded-md font-medium text-sm`}
                                                            style={{
                                                                backgroundColor: `${colorHex}30`,
                                                                color: colorHex,
                                                            }}>
                                                    {statusName.toUpperCase()}
                                                </span>
                                                    );
                                                })()
                                            ) : col.key === "id" ? (
                                                (() => {
                                                    const raw = item.id;
                                                    return raw ? String(raw).slice(0, 8) : "";
                                                })()
                                            ) : col.key === "joiningDate" ? (
                                                (() => {
                                                    console.log("item.joiningDate", item.joiningDate);
                                                    const raw = new Intl.DateTimeFormat("en-US").format(new Date(item.joiningDate));
                                                    return raw ? String(raw).slice(0, 10) : "";
                                                })()
                                            ) : col.key === "social" ? (
                                                <div className="flex gap-2">
                                                    {item.facebook && (
                                                        <a href={item.facebook} target="_blank"
                                                           rel="noopener noreferrer"
                                                           className="text-gray-500 hover:text-purple-800 bg-gray-100 p-2 rounded-full">
                                                            <FaFacebookF size={16} />
                                                        </a>
                                                    )}
                                                    {item.instagram && (
                                                        <a href={item.instagram} target="_blank"
                                                           rel="noopener noreferrer"
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
                                                        onClick={() => {
                                                            if (pathname === "/expenses" && typeof onDelete === "function") {
                                                                onDelete(item.id);
                                                            } else if (pathname === "/clients") {
                                                                dispatch(deleteClient(item.id));
                                                            } else if (pathname === "/campaign") {
                                                                dispatch(deleteCampaign(item.id));
                                                            } else {
                                                                setData(data.filter(d => d.id !== item.id));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ) : col.key === "notes" || col.key === "other" ? (
                                                <div className="truncate max-w-xs" title={item[col.key]}>
                                                    {TruncatedText({ text: item[col.key] })}
                                                </div>
                                            ) : (
                                                typeof item[col.key] === "number" ? (
                                                    <div className="flex items-center gap-0.5">
                                                        {item[col.key]}
                                                        <TbCurrencyDram />
                                                    </div>
                                                ) : (
                                                    item[col.key]
                                                )
                                            )}
                                    </td>
                                );
                            })}
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

                    {pathname === "/expenses" && numericColumns.length > 0 && (
                        <tfoot className="bg-gray-100 font-semibold text-gray-700">
                        <tr>
                            {columns.map(col => {
                                if (col.key === columns[0].key) {
                                    return <td key={col.key} className="p-3">{t("Total")}</td>;
                                }

                                if (totals[col.key] !== undefined) {
                                    return (
                                        <td key={col.key} className="p-3">
                                            <div className="flex items-center gap-0.5">
                                                {totals[col.key]}
                                                <TbCurrencyDram />
                                            </div>
                                        </td>
                                    );
                                }

                                return <td key={col.key} className="p-3"></td>;
                            })}
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
                        dealsList={dealsList}
                        roles={roles}
                        users={users}
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