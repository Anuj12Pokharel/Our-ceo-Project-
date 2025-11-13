import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, Edit, Trash2, Settings, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FloatingInput } from "../ui/FloatingInput";

interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}

const UserTable: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Omit<UserData, "id">>({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "",
    });
    const [roleFilter, setRoleFilter] = useState("");
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const mockData: UserData[] = [
                { id: 1, name: "Alice Johnson", email: "alice@mail.com", phone: "1234567890", address: "New York", role: "Admin" },
                { id: 2, name: "Bob Smith", email: "bob@mail.com", phone: "2345678901", address: "Los Angeles", role: "Customer Support" },
                { id: 3, name: "Charlie Brown", email: "charlie@mail.com", phone: "3456789012", address: "Chicago", role: "Accountant" },
                { id: 4, name: "Diana Prince", email: "diana@mail.com", phone: "4567890123", address: "Houston", role: "Admin" },
                { id: 5, name: "Ethan Hunt", email: "ethan@mail.com", phone: "5678901234", address: "Phoenix", role: "Customer Support" },
                { id: 6, name: "Fiona Gallagher", email: "fiona@mail.com", phone: "6789012345", address: "Philadelphia", role: "Customer Support" },
                { id: 7, name: "George Miller", email: "george@mail.com", phone: "7890123456", address: "San Antonio", role: "Accountant" },
                { id: 8, name: "Hannah Lee", email: "hannah@mail.com", phone: "8901234567", address: "San Diego", role: "Admin" },
                { id: 9, name: "Ian Wright", email: "ian@mail.com", phone: "9012345678", address: "Dallas", role: "Customer Support" },
                { id: 10, name: "Jill Taylor", email: "jill@mail.com", phone: "0123456789", address: "San Jose", role: "Accountant" },
            ];
            setUsers(mockData);
            setFilteredUsers(mockData);
            setLoading(false);
        }, 500);
    }, []);

    // Filter users by role
    useEffect(() => {
        if (!roleFilter) {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(u => u.role === roleFilter));
        }
    }, [roleFilter, users]);

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: "Delete user?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });
        if (!confirm.isConfirmed) return;

        setUsers(prev => prev.filter(u => u.id !== id));

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "User removed successfully",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    // Modify handleAddUser to handle both add and edit
    const handleSaveUser = () => {
        if (editingUserId !== null) {
            // Edit mode
            setUsers(prev =>
                prev.map(u => (u.id === editingUserId ? { id: u.id, ...form } : u))
            );
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "User updated successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            // Add mode
            const newUser: UserData = { id: Date.now(), ...form };
            setUsers(prev => [...prev, newUser]);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "User added successfully",
                showConfirmButton: false,
                timer: 1500,
            });
        }

        setForm({ name: "", email: "", phone: "", address: "", role: "" });
        setEditingUserId(null);
        setShowModal(false);
    };

    // Handle edit button click
    const handleEdit = (user: UserData) => {
        setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role });
        setEditingUserId(user.id);
        setShowModal(true);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-lg">Users</CardTitle>
                        <CardDescription>Manage users, roles, and permissions.</CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => navigate("/role-manager")}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            <Settings className="h-4 w-4" />
                            Role Manager
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                        >
                            <Plus className="h-4 w-4" />
                            Add User
                        </button>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Customer Support">Customer Support</option>
                            <option value="Accountant">Accountant</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredUsers.length === 0 ? (
                        <p className="text-gray-500">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-gray-600">
                                        <th className="px-4 py-2 font-medium">S.N</th>
                                        <th className="px-4 py-2 font-medium">Name</th>
                                        <th className="px-4 py-2 font-medium">Email</th>
                                        <th className="px-4 py-2 font-medium">Phone</th>
                                        <th className="px-4 py-2 font-medium">Address</th>
                                        <th className="px-4 py-2 font-medium">Role</th>
                                        <th className="px-4 py-2 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u, idx) => (
                                        <tr key={u.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{idx + 1}</td>
                                            <td className="px-4 py-2">{u.name}</td>
                                            <td className="px-4 py-2">{u.email}</td>
                                            <td className="px-4 py-2">{u.phone}</td>
                                            <td className="px-4 py-2">{u.address}</td>
                                            <td className="px-4 py-2">{u.role}</td>
                                            <td className="px-4 py-2 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEdit(u)}
                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal for Add User */}
            {showModal && (
                <div className="fixed top-[-30px] inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-3 text-gray-500 hover:text-gray-800"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
                        <div className="space-y-3">
                            <FloatingInput label="Name" id="name" name="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <FloatingInput label="Email" id="email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <FloatingInput label="Phone" id="phone" name="phone" type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <FloatingInput label="Address" id="address" name="address" type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                            <FloatingInput label="Role" id="role" name="role" type="select" options={["Admin", "Accountant"]} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary-hover"
                            >
                                {editingUserId !== null ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserTable;
