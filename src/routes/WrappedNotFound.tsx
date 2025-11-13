import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import NotFound from "@/pages/NotFound";

export default function WrappedNotFound() {
    const { user } = useAuth();

    if (user) {
        return (
            <DashboardLayout>
                <NotFound />
            </DashboardLayout>
        );
    }

    return <NotFound />;
}
