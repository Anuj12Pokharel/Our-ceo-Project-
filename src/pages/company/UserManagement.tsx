import UserTable from "@/components/userManagement/UserTable";

const UserManagement = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">User Management</h1>
            <UserTable />
        </div>
    );
};

export default UserManagement;
