"use client";

import { useState } from "react";
import { FiMail, FiEdit2, FiTrash } from "react-icons/fi";

const leadsData = [
    {
        id: 101,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "555-1234",
        joiningDate: "2025-09-15",
        notes: "Interested in premium package",
        source: "Facebook Ads",
        status: "New",
    },
    {
        id: 102,
        name: "Bob Smith",
        email: "bob.smith@example.com",
        phone: "555-5678",
        joiningDate: "2025-09-14",
        notes: "Requested demo",
        source: "Google Campaign",
        status: "Contacted",
    },
];

const getStatusColor = (status) => {
    switch(status) {
        case "New": return "bg-blue-200 text-blue-800";
        case "Contacted": return "bg-yellow-200 text-yellow-800";
        case "Accepted": return "bg-green-200 text-green-800";
        case "No Accepted": return "bg-red-200 text-red-800";
        default: return "bg-gray-200 text-gray-800";
    }
};

export default function LeadsPage() {
    const [leads, setLeads] = useState(leadsData);
    const [showForm, setShowForm] = useState(false);
    const [editingLeadId, setEditingLeadId] = useState(null);
    const [leadForm, setLeadForm] = useState({
        name: "",
        email: "",
        phone: "",
        joiningDate: "",
        notes: "",
        source: "",
        status: "",
    });

    const handleAddOrEditLead = () => {
        if (editingLeadId) {
            setLeads(leads.map(l => l.id === editingLeadId ? { id: editingLeadId, ...leadForm } : l));
        } else {
            const id = Math.floor(Math.random() * 100000);
            setLeads([...leads, { id, ...leadForm }]);
        }
        setLeadForm({
            name: "",
            email: "",
            phone: "",
            joiningDate: "",
            notes: "",
            source: "",
            status: "",
        });
        setEditingLeadId(null);
        setShowForm(false);
    };

    const handleEditClick = (lead) => {
        setEditingLeadId(lead.id);
        setLeadForm({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            joiningDate: lead.joiningDate,
            notes: lead.notes,
            source: lead.source,
            status: lead.status,
        });
        setShowForm(true);
    };

    return (
        <div className="p-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Leads</h1>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingLeadId(null);
                        setLeadForm({
                            name: "",
                            email: "",
                            phone: "",
                            joiningDate: "",
                            notes: "",
                            source: "",
                            status: "",
                        });
                    }}
                >
                    Add Lead
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-4 p-4 border rounded shadow bg-gray-50 space-y-2">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 w-full"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 w-full"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="border p-2 w-full"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Joining Date"
                        className="border p-2 w-full"
                        value={leadForm.joiningDate}
                        onChange={(e) => setLeadForm({ ...leadForm, joiningDate: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Source"
                        className="border p-2 w-full"
                        value={leadForm.source}
                        onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    />
                    <select className="border p-2 w-full" value={leadForm.status}
                            onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}>
                        <option value="">Select Stage</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="No Accepted">No Accepted</option>
                    </select>
                    <textarea
                        placeholder="Notes"
                        className="border p-2 w-full"
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                    />
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={handleAddOrEditLead}
                    >
                        {editingLeadId ? "Update" : "Save"}
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3"><input type="checkbox" /></th>
                        <th className="p-3">#</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Joining Date</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Notes</th>
                        <th className="p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id} className="border-t hover:bg-gray-50">
                            <td className="p-3"><input type="checkbox" /></td>
                            <td className="p-3">{lead.id}</td>
                            <td className="p-3 font-medium">{lead.name}</td>
                            <td className="p-3">{lead.email}</td>
                            <td className="p-3">{lead.phone}</td>
                            <td className="p-3">{lead.joiningDate}</td>
                            <td className="p-3">{lead.source}</td>
                            <td className="p-3">
                                <span
                                    className={`py-1 px-3 rounded-md font-medium text-sm ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td className="p-3">{lead.notes}</td>
                            <td className="p-3 flex gap-3 text-gray-500">
                                <FiMail
                                    className="cursor-pointer hover:text-purple-600"
                                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${lead.email}`, "_blank")}
                                />
                                <FiEdit2
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() => handleEditClick(lead)}
                                />
                                <FiTrash
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => setLeads(leads.filter(l => l.id !== lead.id))}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
