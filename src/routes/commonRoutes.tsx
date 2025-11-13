import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized";

export const commonRoutes = [
    { path: "/", element: <Index /> },
    { path: "/login", element: <Login /> },
    { path: "/unauthorized", element: <Unauthorized /> },
];
