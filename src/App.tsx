import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { commonRoutes } from "./routes/commonRoutes";
import { companyRoutes } from "./routes/companyRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { userRoutes } from "./routes/userRoutes";

import { PersonalizationProvider } from "./hooks/use-personalization";
import { AuthProvider } from "./context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import WrappedNotFound from "./routes/WrappedNotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

// Helper to render routes recursively
const renderRoutes = (routes: any[]) =>
  routes.map(({ path, element, children }, index) => (
    <Route key={index} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter basename="/">
            <PersonalizationProvider isIndexPage={window.location.pathname === "/"}>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  {/* Common routes (public) */}
                  {renderRoutes(commonRoutes)}

                  {/* Admin routes */}
                  {adminRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <DashboardLayout>{route.element}</DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                  ))}

                  {/* Company routes */}
                  {companyRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute requiredRole="company">
                          <DashboardLayout>{route.element}</DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                  ))}

                  {/* User routes */}
                  {userRoutes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <ProtectedRoute requiredRole="user">
                          <DashboardLayout>{route.element}</DashboardLayout>
                        </ProtectedRoute>
                      }
                    />
                  ))}

                  {/* Catch-all 404 for logged-in users */}
                  <Route
                    path="*"
                    element={
                      <ProtectedRoute>
                        <WrappedNotFound />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all 404 for non-authenticated users */}
                  <Route path="*" element={<WrappedNotFound />} />
                </Routes>
              </Suspense>
            </PersonalizationProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
