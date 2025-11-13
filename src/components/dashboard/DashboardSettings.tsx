import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface DashboardSettingsProps {
  visibleComponents: Record<string, boolean>;
  componentLabels: Record<string, string>; // dynamic labels
  onToggleComponent: (componentId: string) => void;
  onResetLayout: () => void;
}

export const DashboardSettings = ({
  visibleComponents,
  componentLabels,
  onToggleComponent,
  onResetLayout
}: DashboardSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Settings className="w-4 h-4" />
        <span>Dashboard Settings</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 w-80 z-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Customize Dashboard</span>
            </CardTitle>
            <CardDescription>
              Choose which components to display
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(componentLabels).map(([componentId, label]) => (
                <div key={componentId} className="flex items-center">
                  <Checkbox
                    id={componentId}
                    checked={visibleComponents[componentId]}
                    onCheckedChange={() => onToggleComponent(componentId)}
                    style={{ display: 'none' }}
                  />
                  <Label htmlFor={componentId} className="flex items-center space-x-2 cursor-pointer">
                    {visibleComponents[componentId] ? (
                      <Eye className="w-4 h-4 text-success" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span>{label}</span>
                  </Label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetLayout}
                className="w-full"
              >
                Reset to Default Layout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
