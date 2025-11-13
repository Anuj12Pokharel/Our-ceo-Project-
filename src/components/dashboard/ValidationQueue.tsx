import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const validationQueue = [
  {
    id: 1,
    client: "Jessica Anderson",
    issue: "Missing superannuation contribution rate",
    priority: "high",
    created: "2024-01-15",
  },
  {
    id: 2,
    client: "Timothy Watene",
    issue: "Inconsistent income figures",
    priority: "medium",
    created: "2024-01-15",
  },
  {
    id: 3,
    client: "Sarah Wilson",
    issue: "Duplicate asset entries",
    priority: "low",
    created: "2024-01-14",
  },
];

const getPriorityBadge = (priority: string) => {
  const variants = {
    high: "destructive",
    medium: "secondary",
    low: "outline",
  } as const;
  
  return (
    <Badge variant={variants[priority as keyof typeof variants]}>
      {priority}
    </Badge>
  );
};

export const ValidationQueue = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Items requiring manual review</span>
        <Badge variant="secondary">{validationQueue.length} pending</Badge>
      </div>
      {validationQueue.map((item) => (
        <div key={item.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-fast">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">{item.client}</h4>
            {getPriorityBadge(item.priority)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.issue}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{item.created}</span>
            <Button size="sm" variant="outline">Review</Button>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <Button variant="outline" className="w-full">
          View All Validation Issues
        </Button>
      </div>
    </div>
  );
}; 