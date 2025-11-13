import { Users, Building } from "lucide-react";

const dummyCompanies = [
    { name: "TechCorp", users: 120, status: "Active" },
    { name: "BizSolutions", users: 45, status: "Pending" },
    { name: "GreenTech", users: 78, status: "Active" },
    { name: "HealthPlus", users: 32, status: "Inactive" },
];

export const RecentCompanies = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Companies</h3>
            <ul className="space-y-3">
                {dummyCompanies.map((company, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
                        <div className="flex items-center space-x-2">
                            <Building className="w-5 h-5 text-primary" />
                            <span className="font-medium">{company.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>{company.users} Users</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${company.status === "Active" ? "bg-green-100 text-green-700" : company.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                {company.status}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
