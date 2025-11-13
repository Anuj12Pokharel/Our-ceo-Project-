import React, { useEffect, useState } from "react";
import TabContent, { UserData } from "./TabContent";

export default function Admin() {
    const roleName = "Admin";

    // You control data here (LocalStorage/API)
    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedAccess, setSelectedAccess] = useState<string[]>([]);

    // Load/save however you like (LocalStorage below as an example)
    useEffect(() => {
        const u = localStorage.getItem(`users_${roleName}`);
        const a = localStorage.getItem(`access_${roleName}`);
        if (u) setUsers(JSON.parse(u));
        if (a) setSelectedAccess(JSON.parse(a));
    }, [roleName]);

    useEffect(() => {
        localStorage.setItem(`users_${roleName}`, JSON.stringify(users));
    }, [users, roleName]);

    useEffect(() => {
        localStorage.setItem(`access_${roleName}`, JSON.stringify(selectedAccess));
    }, [selectedAccess, roleName]);

    const handleAddUser = async (u: Omit<UserData, "id">) => {
        const newUser: UserData = { id: Date.now(), ...u };
        setUsers((prev) => [...prev, newUser]);
        // mock API call here if you want
        console.log("Mock API add user:", newUser);
    };

    const handleDeleteUser = async (id: number) => {
        setUsers((prev) => prev.filter((x) => x.id !== id));
        console.log("Mock API delete user:", id);
    };

    const accessOptions = [
        { label: "View Only", value: "view_only" },
        { label: "Full Access", value: "full_access" },
    ];

    return (
        <TabContent
            roleName={roleName}
            accessOptions={accessOptions}
            title="Manage Admin"
            description="Manage admins and access for this role."
            users={users}
            selectedAccess={selectedAccess}
            onSelectedAccessChange={setSelectedAccess}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
        />
    );
}
