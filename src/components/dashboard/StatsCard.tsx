import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  description: string;
}

export const StatsCard = ({ title, value, change, changeType, icon: Icon, description }: StatsCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            changeType === "positive" ? "text-success" : "text-destructive"
          }`}>
            {change}
          </span>
          <span className="text-sm text-muted-foreground">from last month</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}; 