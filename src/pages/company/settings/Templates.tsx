import {
    Mail,
    ClipboardCheck,
    MessageSquareMore,
} from "lucide-react";
import CustomTabs from "@/components/CustomTabs";
import EmailTemplate from "@/components/settings/EmailTemplate";
import TaskTemplate from "@/components/settings/TaskTemplate";
import SmsTemplate from "@/components/settings/SmsTemplate";

const Templates = () => {
    const tabs = [
        {
            value: "emailTemplates",
            label: "Email Templates",
            icon: <Mail className="w-4 h-4" />,
            content: <EmailTemplate />,
        },
        {
            value: "taskTemplates",
            label: "Task Templates",
            icon: <ClipboardCheck className="w-4 h-4" />,
            content: <TaskTemplate />,
        },
        {
            value: "smsTemplates",
            label: "SMS Templates",
            icon: <MessageSquareMore className="w-4 h-4" />,
            content: <SmsTemplate />,
        },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Settings</h1>
            <CustomTabs tabs={tabs} defaultValue="emailTemplates" />
        </div>
    );
};

export default Templates;
