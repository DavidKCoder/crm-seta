"use client";

import { useState } from "react";
import { FiMail, FiEdit2, FiTrash } from "react-icons/fi";

const clientsData = [
    {
        id: 70263,
        name: "Adelaide Scott",
        email: "smith_jadyn@gmail.com",
        phone: "845-701-8112",
        note: "781 Klocko Row",
    },
    {
        id: 59991,
        name: "Minerva Atkins",
        email: "murray_kianna@gmail.com",
        phone: "481-648-1385",
        note: "04 Jeff Estate",
    },
    {
        id: 74320,
        name: "Lottie Watts",
        email: "bashirian.laurenta@gmail.com",
        phone: "768-939-3835",
        note: "879 Lorenzo Meadow Apt. 812",
    },
    {
        id: 38632,
        name: "Bernard Pratt",
        email: "arielle_schiller@imogene.net",
        phone: "199-463-4077",
        note: "270 Suzanne Centers Apt. 440",
    },
    {
        id: 60348,
        name: "Norman Fowler",
        email: "krajcik_mavis@june.net",
        phone: "344-817-4239",
        note: "30 Albina Drive Apt. 284",
    },
];

export default function ClientsPage() {
    const [clients, setClients] = useState(clientsData);
    const [showForm, setShowForm] = useState(false);
    const [editingClientId, setEditingClientId] = useState(null);
    const [clientForm, setClientForm] = useState({ name: "", email: "", phone: "", note: "" });

    const handleAddOrEditClient = () => {
        if (editingClientId) {
            setClients(clients.map(c => c.id === editingClientId ? { id: editingClientId, ...clientForm } : c));
        } else {
            const id = Math.floor(Math.random() * 100000);
            setClients([...clients, { id, ...clientForm }]);
        }
        setClientForm({ name: "", email: "", phone: "", note: "" });
        setEditingClientId(null);
        setShowForm(false);
    };

    const handleEditClick = (client) => {
        setEditingClientId(client.id);
        setClientForm({ name: client.name, email: client.email, phone: client.phone, note: client.note });
        setShowForm(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contacts</h1>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingClientId(null);
                        setClientForm({ name: "", email: "", phone: "", note: "" });
                    }}
                >
                    Add Contact
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-4 p-4 border rounded shadow bg-gray-50">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 mb-2 w-full"
                        value={clientForm.name}
                        onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 mb-2 w-full"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="border p-2 mb-2 w-full"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Note"
                        className="border p-2 mb-2 w-full"
                        value={clientForm.note}
                        onChange={(e) => setClientForm({ ...clientForm, note: e.target.value })}
                    />
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={handleAddOrEditClient}
                    >
                        {editingClientId ? "Update" : "Save"}
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
                        <th className="p-3">Note</th>
                        <th className="p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className="border-t hover:bg-gray-50">
                            <td className="p-3"><input type="checkbox" /></td>
                            <td className="p-3">{client.id}</td>
                            <td className="p-3 font-medium">{client.name}</td>
                            <td className="p-3">{client.email}</td>
                            <td className="p-3">{client.phone}</td>
                            <td className="p-3">{client.note}</td>
                            <td className="p-3 flex gap-3 text-gray-500">
                                <FiMail
                                    className="cursor-pointer hover:text-purple-600"
                                    onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${client.email}`, "_blank")}
                                />

                                <FiEdit2
                                    className="cursor-pointer hover:text-blue-600"
                                    onClick={() => handleEditClick(client)}
                                />
                                <FiTrash
                                    className="cursor-pointer hover:text-red-600"
                                    onClick={() => setClients(clients.filter(c => c.id !== client.id))}
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
