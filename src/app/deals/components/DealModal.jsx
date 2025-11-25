"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoMdClose, IoMdAttach } from "react-icons/io";
import { TbCurrencyDram } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { apiDelete, apiGet, apiUpload, apiDownload } from "@/lib/apiClient";

export default function DealModal({
                                      show,
                                      onClose,
                                      onSave,
                                      formData,
                                      setFormData,
                                      editingDeal,
                                      clients = [],
                                      campaigns = [],
                                      currentUser,
                                      statuses = [],
                                      roles = [],
                                  }) {
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [removingAttachmentId, setRemovingAttachmentId] = useState(null);
    const fileInputRef = useRef(null);
    const assignedDropdownRef = useRef(null);
    const [isAssignedDropdownOpen, setIsAssignedDropdownOpen] = useState(false);

    // Get statuses from props (passed from DealsPageContent)
    const statusOptions = statuses || [];

    // Set default status if not set
    useEffect(() => {
        if (statusOptions.length > 0 && !formData.statusId) {
            setFormData(prev => ({
                ...prev,
                statusId: statusOptions[0].id,
            }));
        }
    }, [statusOptions]);

    useEffect(() => setErrors({}), [show]);

    // Close the assigned users dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!assignedDropdownRef.current) return;
            if (!assignedDropdownRef.current.contains(event.target)) {
                setIsAssignedDropdownOpen(false);
            }
        };

        if (isAssignedDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAssignedDropdownOpen]);

    // Fetch users for the dropdown and load attachments when editing
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users
                const usersResponse = await apiGet("/api/users");
                if (usersResponse?.data) {
                    setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
                }

                // Load attachments if editing
                if (editingDeal?.id) {
                    const attachmentsResponse = await apiGet(`/api/deals/${editingDeal.id}/attachments`);
                    if (attachmentsResponse?.data) {
                        setAttachments(Array.isArray(attachmentsResponse.data) ? attachmentsResponse.data : []);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [editingDeal?.id]);

    if (!show) return null;

    const validate = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.entityType) newErrors.entityType = t("Entity type is required");
        if (!formData.entityId) newErrors.entityId = t("Entity is required");
        if (!formData.statusId) newErrors.statusId = t("Status is required");
        const hasAssignedSingle = !!formData.assignedToUserId;
        const hasAssignedMultiple = Array.isArray(formData.assignedToUserIds) && formData.assignedToUserIds.length > 0;
        if (!hasAssignedSingle && !hasAssignedMultiple) newErrors.assignedToUserId = t("Assigned User is required");
        if (!formData.value || formData.value <= 0) newErrors.value = t("Value must be greater than zero");
        if (!formData.currency) newErrors.currency = t("Currency is required");
        if (!formData.name?.trim()) newErrors.name = t("Name is required");
        if (!formData.email?.trim()) newErrors.email = t("Email is required");
        if (!formData.phone?.trim()) newErrors.phone = t("Phone is required");

        // Email format validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t("Please enter a valid email address");
        }
        // Phone format validation (basic)
        if (formData.phone && !/^\+?[0-9\s-]{6,}$/.test(formData.phone)) {
            newErrors.phone = t("Please enter a valid phone number");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        console.log("Selected file:", file);

        if (!file || !editingDeal?.id) {
            console.log("No file selected or no deal ID");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert(t("File size should be less than 5MB"));
            return;
        }

        const isPdf = file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            alert(t("Only PDF files are allowed"));
            return;
        }

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            setIsUploading(true);
            console.log("Starting upload for deal:", editingDeal.id);

            const response = await apiUpload(
                `/api/deals/${editingDeal.id}/attachments`,
                formData,
            );

            console.log("Upload response:", response);

            if (response?.data) {
                const newAttachments = Array.isArray(response.data) ? response.data : [response.data];
                setAttachments(prev => [...prev, ...newAttachments]);
                console.log("Attachment added successfully");
            } else {
                console.warn("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert(error.message || t("Failed to upload file"));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveAttachment = async (attachmentId) => {
        if (!editingDeal?.id) return;
        if (!confirm(t("Are you sure you want to remove this attachment?"))) return;

        try {
            setRemovingAttachmentId(attachmentId);
            await apiDelete(`/api/deals/${editingDeal.id}/attachments/${attachmentId}`);
            setAttachments(prev => prev.filter(att => att.id !== attachmentId));
        } catch (error) {
            console.error("Error removing attachment:", error);
            alert(t("Failed to remove attachment"));
        } finally {
            setRemovingAttachmentId(null);
        }
    };

    const handleDownloadAttachment = async (attachment) => {
        try {
            const dealId =
                editingDeal?.id ??
                attachment.dealId ??
                attachment.deal?.id;

            const attachmentId =
                attachment.id ??
                attachment.attachmentId ??
                attachment.fileId;

            if (!dealId || !attachmentId) {
                // Fallback to direct URL if available
                if (attachment.downloadUrl || attachment.url || attachment.fileUrl) {
                    window.open(attachment.downloadUrl || attachment.url || attachment.fileUrl, '_blank');
                    return;
                }
                alert(t("Unable to download attachment: missing IDs"));
                return;
            }

            const downloadPath = `/api/deals/${dealId}/attachments/${attachmentId}/download`;
            await apiDownload(downloadPath, attachment.fileName || "attachment.pdf");
        } catch (error) {
            console.error("Error downloading attachment:", error);
            alert(error.message || t("Failed to download attachment"));
        }
    };

    const getAttachmentUrl = (attachment) => {
        if (!attachment) return "#";

        const dealId =
            editingDeal?.id ??
            attachment.dealId ??
            attachment.deal?.id;

        const attachmentId =
            attachment.id ??
            attachment.attachmentId ??
            attachment.fileId;

        // If we still don't have IDs, fall back to whatever URL backend gave us
        if (!dealId || !attachmentId) {
            return attachment.downloadUrl || attachment.url || attachment.fileUrl || "#";
        }

        return `/api/deals/${dealId}/attachments/${attachmentId}/download`;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return t("0 Bytes");
        const k = 1024;
        const sizes = [t("Bytes"), t("KB"), t("MB"), t("GB")];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (value) => {
        // Remove all non-digit characters and leading zeros
        return value.replace(/\D/g, "").replace(/^0+/, "") || "0";
    };

    const toggleAssignedUser = (userId) => {
        const id = String(userId);
        const currentIds = Array.isArray(formData.assignedToUserIds)
            ? formData.assignedToUserIds.map(String)
            : [];

        const exists = currentIds.includes(id);
        const nextIds = exists
            ? currentIds.filter((assignedId) => assignedId !== id)
            : [...currentIds, id];

        setFormData(prev => ({
            ...prev,
            assignedToUserIds: nextIds,
            assignedToUserId: nextIds[0] || "",
        }));

        if (errors.assignedToUserId) {
            setErrors(prev => ({
                ...prev,
                assignedToUserId: undefined,
            }));
        }
    };

    const handleSave = () => {
        if (!validate()) {
            return;
        }

        // Prepare the final data structure
        const multipleAssignedIds = Array.isArray(formData.assignedToUserIds)
            ? formData.assignedToUserIds.filter(Boolean)
            : [];
        const primaryAssignedId = multipleAssignedIds.length > 0
            ? multipleAssignedIds[0]
            : (formData.assignedToUserId || null);

        const dealData = {
            entityType: formData.entityType || "client",
            entityId: formData.entityId,
            statusId: formData.statusId,
            value: Number(formData.value) || 0,
            currency: formData.currency || "AMD",
            name: formData.name?.trim() || "",
            email: formData.email?.trim() || "",
            phone: formData.phone?.trim() || "",
            joiningDate: formData.joiningDate || new Date().toISOString().split("T")[0],
            notes: formData.notes || "",
            facebook: formData.facebook || undefined,
            instagram: formData.instagram || undefined,
            website: formData.website || undefined,
            assignedToUserId: primaryAssignedId,
            assignedToUserIds: multipleAssignedIds.length > 0
                ? multipleAssignedIds
                : (primaryAssignedId ? [primaryAssignedId] : []),
            isFinished: formData.isFinished || false,
        };

        onSave(dealData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 text-gray-800">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
                    onClick={onClose}
                >
                    <IoMdClose size={25} />
                </button>

                <h2 className="text-xl font-semibold mb-6">
                    {editingDeal ? t("Edit Deal") : t("Add Deal")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Assigned User */}
                    <div ref={assignedDropdownRef} className="relative">
                        <label className="block text-sm font-medium mb-1">
                            {t("Assigned User")} <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsAssignedDropdownOpen(prev => !prev)}
                            className={`border p-2 w-full rounded flex justify-between items-center ${
                                errors.assignedToUserId ? "border-red-500" : ""
                            }`}
                        >
                            <span className="truncate text-left">
                                {Array.isArray(formData.assignedToUserIds) && formData.assignedToUserIds.length > 0
                                    ? formData.assignedToUserIds
                                        .map((id) => {
                                            const matchedUser = users.find((user) => String(user?.id) === String(id));
                                            if (!matchedUser) return null;
                                            const firstName = matchedUser?.firstName || "";
                                            const lastName = matchedUser?.lastName || "";
                                            const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
                                            return displayName || matchedUser?.email || t("Unnamed User");
                                        })
                                        .filter(Boolean)
                                        .join(", ")
                                    : t("Select users")}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isAssignedDropdownOpen ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                            </svg>
                        </button>
                        {isAssignedDropdownOpen && (
                            <div
                                className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-56 overflow-auto"
                            >
                                {users.length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">{t("No users available")}</div>
                                )}
                                {users.map(user => {
                                    try {
                                        const userId = user?.id;
                                        if (!userId) return null;
                                        const normalizedId = String(userId);
                                        const userRoles = Array.isArray(user?.roles) ? user.roles : [];
                                        const userRole = userRoles.length > 0
                                            ? (typeof userRoles[0] === "string" ? userRoles[0] : userRoles[0]?.name || "No Role")
                                            : "No Role";
                                        const firstName = user?.firstName || "";
                                        const lastName = user?.lastName || "";
                                        const displayName = [firstName, lastName].filter(Boolean).join(" ").trim() || "Unnamed User";
                                        const isChecked = Array.isArray(formData.assignedToUserIds)
                                            ? formData.assignedToUserIds.map(String).includes(normalizedId)
                                            : false;
                                        const isActive = user?.isActive

                                        return (
                                            <label
                                                key={normalizedId}
                                                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                                            >
                                                <div className={`flex items-center gap-2 ${!isActive ? "text-gray-400" : ""}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        disabled={!isActive}
                                                        onChange={() => toggleAssignedUser(normalizedId)}
                                                    />
                                                    <span>{displayName}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{userRole}</span>
                                            </label>
                                        );
                                    } catch (error) {
                                        console.error("Error rendering user option:", error, user);
                                        return null;
                                    }
                                }).filter(Boolean)}
                            </div>
                        )}
                        {errors.assignedToUserId &&
                            <p className="text-red-500 text-xs mt-1">{errors.assignedToUserId.replace("Role", "User")}</p>}
                    </div>

                    {/* Entity Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Entity Type")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.entityType || "client"}
                            onChange={(e) => handleInputChange("entityType", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.entityType ? "border-red-500" : ""}`}
                        >
                            <option value="client">{t("Client")}</option>
                            <option value="campaign">{t("Campaign")}</option>
                        </select>
                        {errors.entityType && <p className="text-red-500 text-xs mt-1">{errors.entityType}</p>}
                    </div>

                    {/* Entity Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {formData.entityType === "campaign" ? t("Campaign") : t("Client")} <span
                            className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.entityId || ""}
                            onChange={(e) => handleInputChange("entityId", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.entityId ? "border-red-500" : ""}`}
                        >
                            <option value="">
                                {formData.entityType === "campaign" ? t("Select Campaign") : t("Select Client")}
                            </option>
                            {(formData.entityType === "campaign" ? campaigns : clients).map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        {errors.entityId && <p className="text-red-500 text-xs mt-1">{errors.entityId}</p>}
                    </div>

                    {/* Status (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Status")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.statusId || ""}
                            onChange={(e) => handleInputChange("statusId", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.statusId ? "border-red-500" : ""}`}
                        >
                            <option value="" disabled>{t("Select Status")}</option>
                            {statusOptions.map(status => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                        {errors.statusId && <p className="text-red-500 text-xs mt-1">{errors.statusId}</p>}
                    </div>

                    {/* Name (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Name")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t("Name")}
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Currency (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Currency")} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.currency || "AMD"}
                            onChange={(e) => handleInputChange("currency", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.currency ? "border-red-500" : ""}`}
                        >
                            <option value="AMD">AMD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="RUB">RUB</option>
                        </select>
                        {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency}</p>}
                    </div>

                    {/* Value (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Value")} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="0.00"
                                value={formData.value || ""}
                                onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value);
                                    handleInputChange("value", formatted ? parseInt(formatted) : "");
                                }}
                                className={`border p-2 w-full rounded pl-8 ${errors.value ? "border-red-500" : ""}`}
                            />
                            <TbCurrencyDram className="absolute left-2 top-3 text-gray-400" />
                        </div>
                        {errors.value && <p className="text-red-500 text-xs mt-1">{errors.value}</p>}
                    </div>

                    {/* Email (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Email")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder={t("Email")}
                            value={formData.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone (required) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Phone")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder={t("Phone")}
                            value={formData.phone || ""}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className={`border p-2 w-full rounded ${errors.phone ? "border-red-500" : ""}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Joining Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Joining Date")}
                        </label>
                        <input
                            type="date"
                            value={formData.joiningDate || ""}
                            onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Facebook")}
                        </label>
                        <input
                            type="url"
                            placeholder={t("Facebook URL placeholder")}
                            value={formData.facebook || ""}
                            onChange={(e) => handleInputChange("facebook", e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Instagram")}
                        </label>
                        <input
                            type="url"
                            placeholder={t("Instagram URL placeholder")}
                            value={formData.instagram || ""}
                            onChange={(e) => handleInputChange("instagram", e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {t("Website")}
                        </label>
                        <input
                            type="url"
                            placeholder={t("Website URL placeholder")}
                            value={formData.website || ""}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                    </div>

                    <div className="lg:col-span-3 flex items-center">
                        <input
                            type="checkbox"
                            id="isFinished"
                            checked={formData.isFinished || false}
                            onChange={(e) => handleInputChange("isFinished", e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isFinished" className="ml-2 block text-sm text-gray-700">
                            {t("Mark as finished")}
                        </label>
                    </div>

                    {editingDeal?.id && (
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium mb-1">
                                {t("Attachments")}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    disabled={isUploading}
                                >
                                    <IoMdAttach className="mr-2" />
                                    {isUploading ? t("Uploading...") : t("Upload PDF (Max 5MB)")}
                                </button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    {t("Only PDF files are accepted")}
                                </p>

                                {/* Attachments list */}
                                {attachments.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2">{t("Attached Files")}:</h4>
                                        <div className="space-y-3">
                                            {attachments.map((attachment) => (
                                                <div key={attachment.id} className="border rounded-lg p-3 bg-gray-50">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1 min-w-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDownloadAttachment(attachment)}
                                                                className="text-blue-600 hover:underline text-sm font-medium truncate block text-left cursor-pointer"
                                                                title={attachment.fileName}
                                                            >
                                                                {attachment.fileName}
                                                            </button>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                <span>{formatFileSize(attachment.fileSize)}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>{formatDate(attachment.createdAt)}</span>
                                                                {attachment.uploadedBy && (
                                                                    <>
                                                                        <span className="mx-2">•</span>
                                                                        <span>
                                                                            {attachment.uploadedBy.firstName} {attachment.uploadedBy.lastName}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttachment(attachment.id)}
                                                            className="text-gray-400 hover:text-red-500 ml-2 disabled:opacity-50"
                                                            disabled={isUploading || removingAttachmentId === attachment.id}
                                                            title="Remove attachment"
                                                        >
                                                            <IoMdClose size={18} className="cursor-pointer"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium mb-1">
                            {t("Notes")}
                        </label>
                        <textarea
                            placeholder={t("Notes")}
                            value={formData.notes || ""}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            className="border p-2 w-full rounded min-h-[100px]"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    >
                        {editingDeal ? t("Update") : t("Create")}
                    </button>
                </div>
            </div>
        </div>
    );
}
