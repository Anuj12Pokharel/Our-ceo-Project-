import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { ReactNode } from "react";

type TabItem = {
    value: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    hidden?: boolean;
};

type CustomTabsProps = {
    defaultValue?: string;
    tabs: TabItem[];
    value?: string; // controlled value
    onValueChange?: (value: string) => void; // controlled change handler
};

const CustomTabs = ({ defaultValue = "details", tabs, value, onValueChange }: CustomTabsProps) => {
    return (
        <Tabs value={value} defaultValue={defaultValue} onValueChange={onValueChange} className="space-y-6">
            <div className="w-full overflow-x-auto no-scrollbar">
                <TabsList className="flex justify-start w-full overflow-x-auto whitespace-nowrap no-scrollbar gap-2 px-1">
                    {tabs
                        .filter((tab) => !tab.hidden)
                        .map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                </TabsList>
            </div>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default CustomTabs;
