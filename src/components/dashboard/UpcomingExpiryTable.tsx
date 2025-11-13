import React from "react";

const upcomingExpiry = [
    {
        company: "Alpha Inc",
        users: 120,
        contact: { email: "alpha@example.com", phone: "+1-234-567-890" },
        expiryDate: "2025-09-15",
        daysLeft: 27,
    },
    {
        company: "Beta Ltd",
        users: 75,
        contact: { email: "beta@example.com", phone: "+1-987-654-321" },
        expiryDate: "2025-08-30",
        daysLeft: 11,
    },
    {
        company: "Gamma Corp",
        users: 200,
        contact: { email: "gamma@example.com", phone: "+44-20-1234-5678" },
        expiryDate: "2025-08-22",
        daysLeft: 3,
    },
];

export default function UpcomingExpiryTable() {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upcoming Expiry</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Company</th>
                            <th className="p-3">Users</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Expiry Date</th>
                            <th className="p-3">Days Left</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingExpiry.map((item, idx) => (
                            <tr
                                key={idx}
                                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="p-3">{item.company}</td>
                                <td className="p-3">{item.users}</td>
                                <td className="p-3">
                                    <div>{item.contact.email}</div>
                                    <div className="text-gray-500 text-xs">
                                        {item.contact.phone}
                                    </div>
                                </td>
                                <td className="p-3">{item.expiryDate}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white text-xs ${item.daysLeft <= 5
                                            ? "bg-red-500"
                                            : item.daysLeft <= 15
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                            }`}
                                    >
                                        {item.daysLeft} days
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
