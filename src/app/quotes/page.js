"use client";

import { useState } from "react";
import { FiMail, FiEdit2, FiTrash } from "react-icons/fi";

const quotesData = [
    { id: 301, customer: { name: "Alice Johnson", email: "alice.johnson@example.com", phone: "555-1234" }, package: "Starter SMM", quantity: 2, price: 500, status: "Sent" },
    { id: 302, customer: { name: "Bob Smith", email: "bob.smith@example.com", phone: "555-5678" }, package: "Service B", quantity: 1, price: 1200, status: "Draft" },
    { id: 303, customer: { name: "Carol Davis", email: "carol.davis@example.com", phone: "555-8765" }, package: "Ultimate SMM", quantity: 5, price: 150, status: "Accepted" },
];

const getStatusColor = (status) => {
    switch(status) {
        case "Draft": return "bg-gray-200 text-gray-800";
        case "Sent": return "bg-blue-200 text-blue-800";
        case "Accepted": return "bg-green-200 text-green-800";
        case "No Accepted": return "bg-red-200 text-red-800";
        default: return "bg-gray-200 text-gray-800";
    }
};

export default function QuotesPage() {
    const [quotes, setQuotes] = useState(quotesData);
    const [showForm, setShowForm] = useState(false);
    const [editingQuoteId, setEditingQuoteId] = useState(null);
    const [quoteForm, setQuoteForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", package: "", quantity: 1, price: 0, status: "" });

    const handleAddOrEditQuote = () => {
        const customer = { name: quoteForm.customerName, email: quoteForm.customerEmail, phone: quoteForm.customerPhone };
        if (editingQuoteId) {
            setQuotes(quotes.map(q => q.id === editingQuoteId ? { id: editingQuoteId, customer, package: quoteForm.package, quantity: quoteForm.quantity, price: quoteForm.price, status: quoteForm.status } : q));
        } else {
            const id = Math.floor(Math.random() * 100000);
            setQuotes([...quotes, { id, customer, package: quoteForm.package, quantity: quoteForm.quantity, price: quoteForm.price, status: quoteForm.status }]);
        }
        setQuoteForm({ customerName: "", customerEmail: "", customerPhone: "", package: "", quantity: 1, price: 0, status: "" });
        setEditingQuoteId(null);
        setShowForm(false);
    };

    const handleEditClick = (quote) => {
        setEditingQuoteId(quote.id);
        setQuoteForm({
            customerName: quote.customer.name,
            customerEmail: quote.customer.email,
            customerPhone: quote.customer.phone,
            package: quote.package,
            quantity: quote.quantity,
            price: quote.price,
            status: quote.status
        });
        setShowForm(true);
    };

    return (
        <div className="p-0">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quotes</h1>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
                    onClick={() => { setShowForm(!showForm); setEditingQuoteId(null); setQuoteForm({ customerName: "", customerEmail: "", customerPhone: "", package: "", quantity: 1, price: 0, status: "" }); }}
                >
                    Add Quote
                </button>
            </div>

            {showForm && (
                <div className="mb-4 p-4 border rounded shadow bg-gray-50 space-y-2">
                    <input type="text" placeholder="Customer Name" className="border p-2 w-full" value={quoteForm.customerName} onChange={(e) => setQuoteForm({ ...quoteForm, customerName: e.target.value })} />
                    <input type="email" placeholder="Customer Email" className="border p-2 w-full" value={quoteForm.customerEmail} onChange={(e) => setQuoteForm({ ...quoteForm, customerEmail: e.target.value })} />
                    <input type="text" placeholder="Customer Phone" className="border p-2 w-full" value={quoteForm.customerPhone} onChange={(e) => setQuoteForm({ ...quoteForm, customerPhone: e.target.value })} />
                    <input type="text" placeholder="Packages" className="border p-2 w-full" value={quoteForm.package} onChange={(e) => setQuoteForm({ ...quoteForm, package: e.target.value })} />
                    <input type="number" placeholder="Quantity" className="border p-2 w-full" value={quoteForm.quantity} onChange={(e) => setQuoteForm({ ...quoteForm, quantity: parseInt(e.target.value) })} />
                    <input type="number" placeholder="Price" className="border p-2 w-full" value={quoteForm.price} onChange={(e) => setQuoteForm({ ...quoteForm, price: parseFloat(e.target.value) })} />
                    <select className="border p-2 w-full" value={quoteForm.status} onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}>
                        <option value="">Select Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="No Accepted">No Accepted</option>
                    </select>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={handleAddOrEditQuote}>
                        {editingQuoteId ? "Update" : "Save"}
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3"><input type="checkbox" /></th>
                        <th className="p-3">#</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Package</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {quotes.map((quote) => (
                        <tr key={quote.id} className="border-t hover:bg-gray-50">
                            <td className="p-3"><input type="checkbox" /></td>
                            <td className="p-3">{quote.id}</td>
                            <td className="p-3 font-medium">{quote.customer.name} ({quote.customer.email}, {quote.customer.phone})</td>
                            <td className="p-3">{quote.package}</td>
                            <td className="p-3">{quote.quantity}</td>
                            <td className="p-3">${quote.price}</td>
                            <td className="p-3">${quote.quantity * quote.price}</td>
                            <td className="p-3">
                                <span
                                    className={`py-1 px-3 rounded-md font-medium text-sm ${getStatusColor(quote.status)}`}>
                                    {quote.status}
                                </span>
                            </td>
                            <td className="p-3 flex gap-3 text-gray-500">
                                <FiMail className="cursor-pointer hover:text-purple-600"
                                        onClick={() => window.open(`https://mail.google.com/mail/?view=cm&to=${quote.customer.email}`, "_blank")} />
                                <FiEdit2 className="cursor-pointer hover:text-blue-600"
                                         onClick={() => handleEditClick(quote)} />
                                <FiTrash className="cursor-pointer hover:text-red-600"
                                         onClick={() => setQuotes(quotes.filter(q => q.id !== quote.id))} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
