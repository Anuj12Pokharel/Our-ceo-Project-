import { CheckCircle, XCircle, Clock } from "lucide-react";

const recentActivity = [
  {
    id: 1,
    type: "upload",
    message: "New client data uploaded for Jessica Anderson",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "validation",
    message: "Validation completed for Timothy Watene",
    time: "15 minutes ago",
    status: "success",
  },
  {
    id: 3,
    type: "error",
    message: "Data inconsistency found in superannuation records",
    time: "1 hour ago",
    status: "error",
  },
  {
    id: 4,
    type: "report",
    message: "Financial report generated for Smith family",
    time: "2 hours ago",
    status: "success",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "error":
      return <XCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-warning" />;
  }
};

export const RecentActivity = () => {
  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-fast">
          {getStatusIcon(activity.status)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{activity.message}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 