
import AdminDashboard from "../pages/admin/AdminDashboard";
import Companies from "../pages/admin/Companies";
import FieldSettingsPage from "../pages/admin/FieldSettingsPage";


export const adminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/companies", element: <Companies /> },
  {
    path: "/admin/companies/:companyId/fields",
    element: <FieldSettingsPageWrapper />,
  },
];

// Wrapper to extract companyId param and provide onBack
import { useNavigate, useParams } from "react-router-dom";
function FieldSettingsPageWrapper() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  return (
    <FieldSettingsPage
      companyId={companyId as string}
      onBack={() => navigate("/admin/companies")}
    />
  );
}
