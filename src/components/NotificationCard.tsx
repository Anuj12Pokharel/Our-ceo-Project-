import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NotificationCardProps {
    title: string;
    priority: "high" | "medium" | "low" | string;
    length?: number;
    currentIndex?: number;
}

const priorityConfig = {
    high: { label: "High", variant: "destructive" as const },
    medium: { label: "Medium", variant: "warning" as const },
    low: { label: "Low", variant: "default" as const },
};

export function NotificationCard({
    title,
    priority,
    length,
    currentIndex,
}: NotificationCardProps) {
    const { label, variant } = priorityConfig[priority];

    const isLastItem = length !== undefined && currentIndex === length - 1;

    return (
        <div
            className={`p-3 flex justify-between items-center ${isLastItem ? "" : "border-b border-gray-100"
                } hover:bg-gray-100 rounded cursor-pointer`}
        >
            <span className="text-sm">{title}</span>
            <Badge variant={variant}>{label}</Badge>
        </div>
    );
}
