import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

export function generateRoutes(routes: any[], role: "admin" | "company" | "user" | null): RouteObject[] {
    return routes.map(({ path, component }) => {
        const Component = lazy(() => import(component));

        const element =
            role === null ? (
                <Component />
            ) : (
                <ProtectedRoute requiredRole={role}>
                    <DashboardLayout>
                        <Component />
                    </DashboardLayout>
                </ProtectedRoute>
            );

        return { path, element };
    });
}
