import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Users, FileText, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { DraggableComponent } from './DraggableComponent';
import { StatsCard } from './StatsCard';
import { ChartCard } from './ChartCard';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { ValidationQueue } from './ValidationQueue';
import { DashboardSettings } from './DashboardSettings';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { AreaChart } from './AreaChart';

interface DashboardComponent {
  id: string;
  type: string;
  title: string;
  description?: string;
  component: React.ReactNode;
}

const defaultComponentOrder = [
  'stats',
  'quickActions',
  'lineChart',
  'barChart',
  'pieChart',
  'areaChart',
  'recentActivity',
  'validationQueue',
];

const defaultVisibleComponents = {
  stats: true,
  quickActions: true,
  lineChart: true,
  barChart: true,
  pieChart: true,
  areaChart: true,
  recentActivity: true,
  validationQueue: true,
};

const stats = [
  {
    title: "Total Clients",
    value: "247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active client profiles",
  },
  {
    title: "Validation Issues",
    value: "23",
    change: "-8%",
    changeType: "positive" as const,
    icon: AlertTriangle,
    description: "Requiring review",
  },
  {
    title: "Reports Generated",
    value: "89",
    change: "+34%",
    changeType: "positive" as const,
    icon: FileText,
    description: "This month",
  },
  {
    title: "Data Quality",
    value: "94%",
    change: "+2%",
    changeType: "positive" as const,
    icon: Shield,
    description: "Accuracy score",
  },
];

const cumulativeData = {
  data: [
    { month: "Jan", cumulative: 50, newClients: 10 },
    { month: "Feb", cumulative: 70, newClients: 20 },
    { month: "Mar", cumulative: 70, newClients: 20 },
    { month: "Apr", cumulative: 70, newClients: 20 },
  ],
  xKey: "month",
  yAreas: [
    { key: "cumulative", name: "Cumulative Clients", stroke: "#3b82f6", fill: "#3b82f6", stackId: "1" },
    { key: "newClients", name: "New Clients", stroke: "#10b981", fill: "#10b981", stackId: "2" },
  ],
  height: 350,
};

const targetData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 55000 },
  { month: 'Mar', revenue: 58000, target: 60000 },
  { month: 'Apr', revenue: 62000, target: 65000 },
  { month: 'May', revenue: 68000, target: 70000 },
  { month: 'Jun', revenue: 72000, target: 75000 },
];

export const CustomizableDashboard = () => {
  const [componentOrder, setComponentOrder] = useState<string[]>(defaultComponentOrder);
  const [visibleComponents, setVisibleComponents] = useState<Record<string, boolean>>(defaultVisibleComponents);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboardComponentOrder');
    const savedVisibility = localStorage.getItem('dashboardVisibleComponents');

    if (savedOrder) {
      setComponentOrder(JSON.parse(savedOrder));
    }
    if (savedVisibility) {
      setVisibleComponents(JSON.parse(savedVisibility));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('dashboardComponentOrder', JSON.stringify(componentOrder));
  }, [componentOrder]);

  useEffect(() => {
    localStorage.setItem('dashboardVisibleComponents', JSON.stringify(visibleComponents));
  }, [visibleComponents]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setComponentOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Show toast notification
        const componentLabels: Record<string, string> = {
          stats: "Statistics Cards",
          quickActions: "Quick Actions",
          lineChart: "Client Growth Chart",
          barChart: "Revenue Chart",
          pieChart: "Risk Distribution",
          areaChart: "Cumulative Growth",
          recentActivity: "Recent Activity",
          validationQueue: "Validation Queue",
        };

        toast({
          title: "Dashboard Updated",
          description: `Moved ${componentLabels[active.id as string]} to new position`,
          duration: 2000,
        });

        return newOrder;
      });
    }
  };

  const handleToggleComponent = (componentId: string) => {
    setVisibleComponents(prev => {
      const newVisibility = {
        ...prev,
        [componentId]: !prev[componentId]
      };

      // Show toast notification
      const componentLabels: Record<string, string> = {
        stats: "Statistics Cards",
        quickActions: "Quick Actions",
        lineChart: "Client Growth Chart",
        barChart: "Revenue Chart",
        pieChart: "Risk Distribution",
        areaChart: "Cumulative Growth",
        recentActivity: "Recent Activity",
        validationQueue: "Validation Queue",
      };

      toast({
        title: newVisibility[componentId] ? "Component Shown" : "Component Hidden",
        description: `${componentLabels[componentId]} ${newVisibility[componentId] ? 'is now visible' : 'has been hidden'}`,
        duration: 2000,
      });

      return newVisibility;
    });
  };

  const handleResetLayout = () => {
    setComponentOrder(defaultComponentOrder);
    setVisibleComponents(defaultVisibleComponents);

    toast({
      title: "Dashboard Reset",
      description: "Dashboard layout has been reset to default configuration",
      duration: 3000,
    });
  };

  const getComponentConfig = (componentId: string): DashboardComponent | null => {
    switch (componentId) {
      case 'stats':
        return {
          id: 'stats',
          type: 'stats',
          title: 'Statistics',
          component: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          ),
        };
      case 'quickActions':
        return {
          id: 'quickActions',
          type: 'actions',
          title: 'Quick Actions',
          component: <QuickActions />,
        };
      case 'lineChart':
        return {
          id: 'lineChart',
          type: 'chart',
          title: 'Client Growth & Revenue',
          description: 'Monthly client growth and revenue trends',
          component: <LineChart />,
        };
      case 'barChart':
        return {
          id: 'barChart',
          type: 'chart',
          title: 'Revenue vs Target',
          description: 'Monthly revenue performance against targets',
          component: <BarChart
            data={targetData}
            xKey="month"
            bars={[
              { key: 'revenue', name: 'Revenue', fill: '#10b981', axis: 'right' },
              { key: 'target', name: 'Target', fill: '#28a9e0', axis: 'left' },
            ]}
          />,
        };
      case 'pieChart':
        return {
          id: 'pieChart',
          type: 'chart',
          title: 'Client Risk Distribution',
          description: 'Distribution of clients by risk profile',
          component: <PieChart />,
        };
      case 'areaChart':
        return {
          id: 'areaChart',
          type: 'chart',
          title: 'Cumulative Growth',
          description: 'Cumulative client growth over time',
          component: <AreaChart config={cumulativeData} />,
        };
      case 'recentActivity':
        return {
          id: 'recentActivity',
          type: 'activity',
          title: 'Recent Activity',
          description: 'Latest system activities and updates',
          component: <RecentActivity />,
        };
      case 'validationQueue':
        return {
          id: 'validationQueue',
          type: 'queue',
          title: 'Validation Queue',
          description: 'Items requiring manual review',
          component: <ValidationQueue />,
        };
      default:
        return null;
    }
  };

  const visibleComponentConfigs = componentOrder
    .filter(id => visibleComponents[id])
    .map(id => getComponentConfig(id))
    .filter(Boolean) as DashboardComponent[];

  // Separate full-width components from two-column components
  const fullWidthComponents = visibleComponentConfigs.filter(config =>
    config.type === 'stats' || config.type === 'actions'
  );
  const twoColumnComponents = visibleComponentConfigs.filter(config =>
    config.type !== 'stats' && config.type !== 'actions'
  );

  return (
    <div className="p-6 space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your CRM system and data validation status
          </p>
        </div>
        <DashboardSettings
          visibleComponents={visibleComponents}
          componentLabels={{
            stats: "Statistics Cards",
            quickActions: "Quick Actions",
            lineChart: "Client Growth Chart",
            barChart: "Revenue Chart",
            pieChart: "Risk Distribution",
            areaChart: "Cumulative Growth",
            recentActivity: "Recent Activity",
            validationQueue: "Validation Queue",
          }}
          onToggleComponent={handleToggleComponent}
          onResetLayout={handleResetLayout}
        />

      </div>

      {/* Drag and Drop Dashboard */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleComponentConfigs.map(config => config.id)} strategy={rectSortingStrategy}>
          <div className="space-y-6">
            {/* Full-width components (stats and quick actions) */}
            {fullWidthComponents.map((config) => (
              <DraggableComponent key={config.id} id={config.id}>
                <div className="w-full">
                  {config.component}
                </div>
              </DraggableComponent>
            ))}

            {/* Two-column grid for other components */}
            {twoColumnComponents.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {twoColumnComponents.map((config) => (
                  <DraggableComponent key={config.id} id={config.id}>
                    <div className="w-full">
                      <ChartCard
                        title={config.title}
                        description={config.description}
                        className="h-full"
                      >
                        {config.component}
                      </ChartCard>
                    </div>
                  </DraggableComponent>
                ))}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty State */}
      {visibleComponentConfigs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No components visible</p>
            <p>Use the dashboard settings to show components</p>
          </div>
        </div>
      )}
    </div>
  );
}; 