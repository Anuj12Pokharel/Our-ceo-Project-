import Dashboard from "../pages/company/Dashboard";
import ClientList from "../pages/company/ClientList";
import ClientProfile from "../pages/company/ClientProfile";
import UserManagement from "../pages/company/UserManagement";
import RoleManager from "../components/userManagement/RoleManager";
import Profile from "../pages/company/Profile";
import Email from "../pages/company/Email";
import General from "@/pages/company/settings/General";
import Templates from "@/pages/company/settings/Templates";

export const companyRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/people", element: <ClientList /> },
    { path: "/people/:clientId", element: <ClientProfile /> },
    { path: "/user-management", element: <UserManagement /> },
    { path: "/role-manager", element: <RoleManager /> },
    { path: "/profile", element: <Profile /> },
    { path: "/emails", element: <Email /> },
    { path: "/settings/general", element: <General /> },
    { path: "/settings/templates", element: <Templates /> },
];
