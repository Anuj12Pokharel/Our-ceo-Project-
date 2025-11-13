// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
    children,
    requiredRole,
}: {
    children: JSX.Element;
    requiredRole?: "admin" | "company" | "user";
}) {
    const { user } = useAuth();

    if (!user) {
        // not logged in
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // logged in but wrong role
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
