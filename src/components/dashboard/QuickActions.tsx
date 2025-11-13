import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Upload, FileText, BarChart3 } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription>Common tasks and operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto p-4 flex flex-col items-center space-y-2">
            <Upload className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Upload Data</div>
              <div className="text-xs opacity-70">Import client information</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <FileText className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Generate Report</div>
              <div className="text-xs opacity-70">Create client reports</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <BarChart3 className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">View Analytics</div>
              <div className="text-xs opacity-70">Data insights</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};