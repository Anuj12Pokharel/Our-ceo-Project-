import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FloatingInput } from "../ui/FloatingInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Plus, Trash2, X } from "lucide-react";

export interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface TabContentProps {
    roleName: string;
    accessOptions: { label: string; value: string }[];

    // Optional/controlled props
    title?: string;
    description?: string;
    users?: UserData[];
    selectedAccess?: string[];

    // Callbacks to let parent persist to LocalStorage/API
    onAddUser?: (user: Omit<UserData, "id">) => Promise<void> | void;
    onDeleteUser?: (id: number) => Promise<void> | void;
    onSelectedAccessChange?: (values: string[]) => void;
}

type NewUserForm = Omit<UserData, "id">;

const TabContent: React.FC<TabContentProps> = ({
    roleName,
    accessOptions,

    title = "People",
    description = "Manage people for this role. Control access and maintain the list of users.",
    users,
    selectedAccess,

    onAddUser,
    onDeleteUser,
    onSelectedAccessChange,
}) => {
    // If parent passes users/selectedAccess => controlled; else fall back to local state
    const [internalUsers, setInternalUsers] = useState<UserData[]>([]);
    const [internalAccess, setInternalAccess] = useState<string[]>([]);
    const isUsersControlled = useMemo(() => Array.isArray(users), [users]);
    const isAccessControlled = useMemo(() => Array.isArray(selectedAccess), [selectedAccess]);

    const list = isUsersControlled ? (users as UserData[]) : internalUsers;
    const accessList = isAccessControlled ? (selectedAccess as string[]) : internalAccess;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewUserForm>();

    // Handlers
    const handleAccessToggle = (value: string) => {
        const next = accessList.includes(value)
            ? accessList.filter((v) => v !== value)
            : [...accessList, value];

        if (isAccessControlled) {
            onSelectedAccessChange?.(next);
        } else {
            setInternalAccess(next);
            onSelectedAccessChange?.(next);
        }

        Swal.fire({
            toast: true,
            icon: "success",
            title: "Access updated",
            position: "top-end",
            timer: 4000,
            showConfirmButton: false,
        });
    };

    const handleDelete = async (id: number) => {
        try {
            if (onDeleteUser) {
                await onDeleteUser(id);
            } else {
                setInternalUsers((prev) => prev.filter((u) => u.id !== id));
            }

            Swal.fire({
                toast: true,
                icon: "info",
                title: "User removed",
                position: "top-end",
                timer: 4000,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Failed to remove user",
                position: "top-end",
                timer: 4000,
                showConfirmButton: false,
            });
        }
    };

    const onSubmit = async (data: NewUserForm) => {
        try {
            if (onAddUser) {
                await onAddUser(data);
            } else {
                // Uncontrolled fallback: generate id locally
                const newUser: UserData = { id: Date.now(), ...data };
                setInternalUsers((prev) => [...prev, newUser]);
            }

            reset();
            setIsModalOpen(false);

            Swal.fire({
                toast: true,
                icon: "success",
                title: "User added successfully",
                position: "top-end",
                timer: 4000,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Failed to add user",
                position: "top-end",
                timer: 4000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </button>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Users List */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Users</h2>
                            <p className="text-sm text-gray-500">{list.length} total</p>
                        </div>

                        {list.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-md border border-gray-100 p-10 text-center">
                                <p className="text-sm text-gray-600">
                                    No users added yet for <span className="font-medium">{roleName}</span>.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add your first user
                                </button>
                            </div>
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
                                            <th className="px-4 py-2 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((u, idx) => (
                                            <tr
                                                key={u.id}
                                                className="border-t transition-colors hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-2">{idx + 1}</td>
                                                <td className="px-4 py-2 font-medium text-gray-900">{u.name}</td>
                                                <td className="px-4 py-2">{u.email}</td>
                                                <td className="px-4 py-2">{u.phone}</td>
                                                <td className="px-4 py-2">{u.address}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
                    <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-3 top-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="mb-1 text-lg font-semibold">Add New User</h3>
                        <p className="mb-4 text-sm text-gray-500">
                            Add a user to <span className="font-medium">{roleName}</span>.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FloatingInput
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                register={register}
                                rules={{ required: "Name is required" }}
                                error={errors.name}
                            />
                            <FloatingInput
                                label="Email"
                                id="email"
                                name="email"
                                type="email"
                                register={register}
                                rules={{ required: "Email is required" }}
                                error={errors.email}
                            />
                            <FloatingInput
                                label="Phone"
                                id="phone"
                                name="phone"
                                type="text"
                                register={register}
                                rules={{ required: "Phone is required" }}
                                error={errors.phone}
                            />
                            <FloatingInput
                                label="Address"
                                id="address"
                                name="address"
                                type="text"
                                register={register}
                                rules={{ required: "Address is required" }}
                                error={errors.address}
                            />

                            <div className="col-span-1 md:col-span-2 mt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                                >
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TabContent;
