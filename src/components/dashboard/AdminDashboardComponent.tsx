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
import { Users, FileText, AlertTriangle, Shield, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { DraggableComponent } from './DraggableComponent';
import { StatsCard } from './StatsCard';
import { ChartCard } from './ChartCard';
import { RecentActivity } from './RecentActivity';
import { DashboardSettings } from './DashboardSettings';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { AreaChart } from './AreaChart';
import UpcomingExpiryTable from './UpcomingExpiryTable';

interface DashboardComponent {
    id: string;
    type: string;
    title: string;
    description?: string;
    component: React.ReactNode;
}

const defaultComponentOrder = [
    'stats',
    'topCompanyByRevenue',
    'topCompanyByUser',
    'areaChart',
    'recentActivity',
    'upcomingExpiry',
];

const defaultVisibleComponents = {
    stats: true,
    topCompanyByRevenue: true,
    topCompanyByUser: true,
    areaChart: true,
    recentActivity: true,
    upcomingExpiry: true,
};

const stats = [
    {
        title: "Total Companies",
        value: "40",
        change: "+12%",
        changeType: "positive" as const,
        icon: Factory,
        description: "Total companies registered",
    },
    {
        title: "Total Peoples",
        value: "23K",
        change: "-8%",
        changeType: "positive" as const,
        icon: Users,
        description: "Total peoples in the system",
    },
    {
        title: "Reports Generated",
        value: "489",
        change: "+34%",
        changeType: "positive" as const,
        icon: FileText,
        description: "Total reports generated",
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

const areaChartConfig = {
    data: [
        { month: "Jan", cumulative: 50, newCompany: 10 },
        { month: "Feb", cumulative: 70, newCompany: 20 },
        { month: "Mar", cumulative: 70, newCompany: 20 },
        { month: "Apr", cumulative: 70, newCompany: 20 },
    ],
    xKey: "month",
    yAreas: [
        { key: "cumulative", name: "Cumulative Companies", stroke: "#3b82f6", fill: "#3b82f6", stackId: "1" },
        { key: "newCompany", name: "New Companies", stroke: "#10b981", fill: "#10b981", stackId: "2" },
    ],
    height: 350,
};

const topCompanyByRevenue = [
    { company: 'Alpha', revenue: 45000 },
    { company: 'Beta', revenue: 32000 },
    { company: 'Gamma', revenue: 41000 },
    { company: 'Codeilo', revenue: 52000 },
];
const topCompanyByUser = [
    { company: 'Alpha', user: 230 },
    { company: 'Beta', user: 320 },
    { company: 'Gamma', user: 410 },
    { company: 'Codeilo', user: 520 },
];

export const AdminDashboardComponent = () => {
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
        const savedOrder = localStorage.getItem('adminDashboardComponentOrder');
        const savedVisibility = localStorage.getItem('adminDashboardVisibleComponents');

        if (savedOrder) {
            setComponentOrder(JSON.parse(savedOrder));
        }
        if (savedVisibility) {
            setVisibleComponents(JSON.parse(savedVisibility));
        }
    }, []);

    // Save preferences to localStorage
    useEffect(() => {
        localStorage.setItem('adminDashboardComponentOrder', JSON.stringify(componentOrder));
    }, [componentOrder]);

    useEffect(() => {
        localStorage.setItem('adminDashboardVisibleComponents', JSON.stringify(visibleComponents));
    }, [visibleComponents]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setComponentOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over?.id as string);

                const newOrder = arrayMove(items, oldIndex, newIndex);

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
                topCompanyByRevenue: "Top Company by Revenue",
                topCompanyByUser: "Top Company by User",
                pieChart: "Risk Distribution",
                areaChart: "Cumulative Growth",
                recentActivity: "Recent Activity",
                upcomingExpiry: "Upcoming Expiry",
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
            case 'topCompanyByUser':
                return {
                    id: 'topCompanyByUser',
                    type: 'chart',
                    title: 'Top Companies by Users',
                    description: 'Top companies by number of users',
                    component: <BarChart
                        data={topCompanyByUser}
                        xKey="company"
                        bars={[{ key: 'user', name: 'User', fill: '#8bb4fa' }]}
                    />,
                };
            case 'topCompanyByRevenue':
                return {
                    id: 'topCompanyByRevenue',
                    type: 'chart',
                    title: 'Top Companies by Revenue',
                    description: 'Top companies by revenue generated',
                    component: <BarChart
                        data={topCompanyByRevenue}
                        xKey="company"
                        bars={[{ key: 'revenue', name: 'Revenue', fill: '#10b981' }]}
                    />,
                };
            case 'areaChart':
                return {
                    id: 'areaChart',
                    type: 'chart',
                    title: 'Company Growth',
                    description: 'Cumulative company growth over time',
                    component: <AreaChart config={areaChartConfig} />,
                };
            case 'recentActivity':
                return {
                    id: 'recentActivity',
                    type: 'activity',
                    title: 'Recent Activity',
                    description: 'Latest system activities and updates',
                    component: <RecentActivity />,
                };
            case 'upcomingExpiry':
                return {
                    id: 'upcomingExpiry',
                    type: 'queue',
                    title: 'Upcoming Expiry',
                    description: 'Items nearing expiry that require attention',
                    component: <UpcomingExpiryTable />,
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
        config.type === 'stats' || config.type === 'actions' || config.id === 'upcomingExpiry'
    );
    const twoColumnComponents = visibleComponentConfigs.filter(config =>
        config.type !== 'stats' && config.type !== 'actions' && config.id !== 'upcomingExpiry'
    );

    return (
        <div className="p-6 space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your CRM system
                    </p>
                </div>
                <DashboardSettings
                    visibleComponents={visibleComponents}
                    componentLabels={{
                        stats: "Statistics Cards",
                        upcomingExpiry: "Upcoming Expiry",
                        topCompanyByRevenue: "Top Company by Revenue",
                        topCompanyByUser: "Top Company by User",
                        areaChart: "Company Growth",
                        recentActivity: "Recent Activity",
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