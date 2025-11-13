import { Inbox, Send, FileText, Trash2, Pencil } from "lucide-react";
import CustomTabs from "@/components/CustomTabs";
import ComposeTab from "@/components/email/ComposeTab";
import MessagesTab from "@/components/email/MessagesTab";
import { useState } from "react";

const Email = () => {
    const [activeTab, setActiveTab] = useState("inbox");

    const tabs = [
        { value: "inbox", label: "Inbox", icon: <Inbox className="w-4 h-4" />, content: <MessagesTab status="inbox" /> },
        { value: "sent", label: "Sent", icon: <Send className="w-4 h-4" />, content: <MessagesTab status="sent" /> },
        { value: "drafts", label: "Drafts", icon: <FileText className="w-4 h-4" />, content: <MessagesTab status="draft" /> },
        { value: "trash", label: "Trash", icon: <Trash2 className="w-4 h-4" />, content: <MessagesTab status="trash" /> },
        { value: "compose", label: "Compose", icon: <Pencil className="w-4 h-4" />, content: <ComposeTab />, hidden: true },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Emails</h1>
                <button
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover flex gap-2 items-center"
                    onClick={() => setActiveTab("compose")}
                >
                    <Pencil size={18} />
                    Compose
                </button>
            </div>

            <CustomTabs tabs={tabs} value={activeTab} onValueChange={setActiveTab} />
        </div>
    );
};

export default Email;
