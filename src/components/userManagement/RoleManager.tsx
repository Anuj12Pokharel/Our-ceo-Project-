import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ChevronDown, ChevronUp, ArrowLeft, Plus, SquarePenIcon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import { FloatingInput } from "../ui/FloatingInput";

interface RoleGroup {
    id: string;
    category: string;
    options: { label: string; value: string }[];
}

interface RoleData {
    name: string;
    userCount: number;
    permissions: Record<string, string>;
}

interface RoleFormData {
    [roleName: string]: Record<string, string>;
}

const initialRoles: RoleData[] = [
    {
        name: "Admin",
        userCount: 8,
        permissions: {
            People: "View Only",
            Opportunity: "View Only",
            Emails: "View Only",
            Companies: "View Only",
            Reports: "View Only",
            "Doc Centre": "View Only",
            Validation: "View Only",
            Settings: "View Only",
            "Audit Log": "View Only",
        },
    },
    {
        name: "Accountant",
        userCount: 3,
        permissions: {
            People: "View Only",
            Opportunity: "View Only",
            Emails: "View Only",
            Companies: "View Only",
            Reports: "View Only",
            "Doc Centre": "View Only",
            Validation: "View Only",
            Settings: "View Only",
            "Audit Log": "View Only",
        },
    },
];

const initialRoleGroups: RoleGroup[] = [
    { id: "1", category: "People", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "2", category: "Opportunity", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "3", category: "Emails", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "5", category: "Reports", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "6", category: "Doc Centre", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "7", category: "Validation", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "8", category: "Settings", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
    { id: "9", category: "Audit Log", options: [{ label: "View Only", value: "View Only" }, { label: "Full Access", value: "Full Access" }] },
];

const RoleManager: React.FC = () => {
    const navigate = useNavigate();
    const [expandedRoles, setExpandedRoles] = useState<string[]>([]);
    const [roleGroups, setRoleGroups] = useState<RoleGroup[]>(initialRoleGroups);
    const [newGroupName, setNewGroupName] = useState("");
    const [roles, setRoles] = useState<RoleData[]>(initialRoles);
    const [showAddRole, setShowAddRole] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [editingRoleName, setEditingRoleName] = useState<string | null>(null);

    const { control, handleSubmit, watch, setValue } = useForm<RoleFormData>({
        defaultValues: roles.reduce((acc, role) => {
            acc[role.name] = { ...role.permissions };
            return acc;
        }, {} as RoleFormData),
    });

    const toggleRole = (roleName: string) => {
        setExpandedRoles((prev) =>
            prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
        );
    };

    const onSubmit = async (data: RoleFormData) => {
        console.log("Saving roles:", data);
        await new Promise((res) => setTimeout(res, 800));
        Swal.fire("Saved", "Role permissions updated successfully", "success");
    };

    // Temporary add role group
    const addRoleGroup = () => {
        if (!newGroupName.trim()) return;

        const id = (roleGroups.length + 1).toString();
        const newGroup: RoleGroup = {
            id,
            category: newGroupName,
            options: [
                { label: "View Only", value: "View Only" },
                { label: "Full Access", value: "Full Access" },
            ],
        };

        setRoleGroups([...roleGroups, newGroup]);

        // Add default "View Only" permission for all roles
        roles.forEach((role) => {
            setValue(`${role.name}.${newGroupName}`, "View Only");
        });

        setNewGroupName("");
    };

    // Temporary add or edit role
    const saveRole = () => {
        if (!newRoleName.trim()) return;

        if (editingRoleName) {
            // Edit mode
            setRoles((prev) =>
                prev.map((role) =>
                    role.name === editingRoleName
                        ? { ...role, name: newRoleName }
                        : role
                )
            );

            // Update react-hook-form key if needed
            const currentPermissions = watch(editingRoleName);
            if (currentPermissions) {
                setValue(newRoleName, currentPermissions);
            }

            // Remove old key if name changed
            if (editingRoleName !== newRoleName) {
                setValue(editingRoleName, undefined);
            }

        } else {
            // Add mode
            const newRole: RoleData = {
                name: newRoleName,
                userCount: 0,
                permissions: roleGroups.reduce((acc, g) => {
                    acc[g.category] = "View Only";
                    return acc;
                }, {} as Record<string, string>),
            };
            setRoles([...roles, newRole]);
            setValue(newRoleName, { ...newRole.permissions });
        }

        setShowAddRole(false);
        setNewRoleName("");
        setEditingRoleName(null);
    };

    const handleEditRole = (roleName: string) => {
        setNewRoleName(roleName);
        setEditingRoleName(roleName);
        setShowAddRole(true);
    };

    const handleDeleteRole = (roleName: string) => {
        Swal.fire({
            title: `Delete ${roleName}?`,
            text: "This will remove the role from the list.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it",
        }).then((result) => {
            if (result.isConfirmed) {
                setRoles((prev) => prev.filter((r) => r.name !== roleName));
                Swal.fire("Deleted!", `${roleName} has been removed.`, "success");
            }
        });
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border rounded transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>
                <h1 className="text-3xl font-bold flex-1">Role Manager</h1>

                {/* Add Role button */}
                <button
                    type="button"
                    onClick={() => setShowAddRole(true)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary-hover transition"
                >
                    <Plus size={16} /> Add Role
                </button>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4 pt-6">
                        {roles.map((role) => {
                            const isExpanded = expandedRoles.includes(role.name);
                            return (
                                <div
                                    key={role.name}
                                    onClick={() => toggleRole(role.name)}
                                    className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transform transition-all duration-200 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-4 py-4 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                type="button"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                                )}
                                            </button>
                                            <div>
                                                <p className="font-bold text-lg">{role.name}</p>
                                                <p className="text-[0.7rem] text-gray-500 mt-[-2px]">
                                                    {role.userCount} users
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditRole(role.name);
                                                }}
                                                className="p-1 hover:bg-blue-100 rounded"
                                                title="Edit Role"
                                            >
                                                <SquarePenIcon size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRole(role.name);
                                                }}
                                                className="p-1 hover:bg-red-100 rounded"
                                                title="Delete Role"
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`transition-max-height duration-500 ease-in-out overflow-hidden px-4`}
                                        style={{ maxHeight: isExpanded ? "1000px" : "0px" }}
                                    >
                                        <div className="py-4 flex gap-10 flex-wrap">
                                            {roleGroups.map((group) => (
                                                <div key={group.category} className="flex flex-wrap gap-6">
                                                    <Controller
                                                        name={`${role.name}.${group.category}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <FloatingInput
                                                                id={group.id}
                                                                type="radio-group"
                                                                label={group.category}
                                                                name={field.name}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                groupOptions={group.options}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition"
                            >
                                Save
                            </button>
                        </div>
                    </CardContent>
                </form>
            </Card>

            {/* Add Role Popup */}
            {showAddRole && (
                <div className="fixed top-[-30px] inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg space-y-4">
                        <h2 className="text-lg font-bold">Add New Role</h2>
                        <input
                            type="text"
                            placeholder="Role Name"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded border"
                                onClick={() => setShowAddRole(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover"
                                onClick={saveRole}
                            >
                                {editingRoleName ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManager;
