import {
    LightbulbIcon,
    FileCog,
    Mail,
    BlocksIcon,
    LayoutListIcon,
    Palette,
    ClipboardCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import CustomTabs from "@/components/CustomTabs";
import OpportunityTypes from "@/components/settings/OpportunityTypes";
import StatusEditor from "@/components/settings/StatusEditor";
import EmailTemplate from "@/components/settings/EmailTemplate";
import { FormBuilder } from "@/components/settings/FormBuilder";
import Personalization from "@/components/settings/Personalization";
import TaskTemplate from "@/components/settings/TaskTemplate";

const General = () => {
    const tabs = [
        {
            value: "opportunityTypes",
            label: "Opportunity Types",
            icon: <LightbulbIcon className="w-4 h-4" />,
            content: <OpportunityTypes />,
        },
        {
            value: "statusEditor",
            label: "Status Editor",
            icon: <FileCog className="w-4 h-4" />,
            content: <StatusEditor />,
        },
        {
            value: "categories",
            label: "Manage Categories",
            icon: <BlocksIcon className="w-4 h-4" />,
            content: (
                <Card>
                    <CardHeader>
                        <CardTitle>People Categories</CardTitle>
                        <CardDescription>
                            Categories can be used as way of classifying your contacts in any way that is useful to your business. People can be added to multiple categories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
            ),
        },
        {
            value: "formBuilder",
            label: "Form Builder",
            icon: <LayoutListIcon className="w-4 h-4" />,
            content: <FormBuilder />,
        },
        {
            value: "personalization",
            label: "Personalization",
            icon: <Palette className="w-4 h-4" />,
            content: <Personalization />,
        },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Settings</h1>
            <CustomTabs tabs={tabs} defaultValue="opportunityTypes" />
        </div>
    );
};

export default General;
