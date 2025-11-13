import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getMessages, updateMessage, deleteMessage } from "@/utils/messages";
import { Message } from "@/types/types";
import ViewEmail from "./ViewEmail";
import { Search, Trash2Icon } from "lucide-react";
import { Input } from "../ui/input";

type Props = { status: Message["status"] };

const MessagesTab = ({ status }: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [search, setSearch] = useState("");
    const [viewing, setViewing] = useState<Message | null>(null);

    const loadMessages = () => {
        setMessages(getMessages().filter((m) => m.status === status));
    };

    useEffect(() => {
        loadMessages();
    }, [status]);

    const handleDelete = (id: string) => {
        updateMessage(id, {
            status: "trash",
            deletedFrom: status as "inbox" | "sent" | "draft",
        });
        loadMessages();
    };

    const handleRestore = (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (!msg || !msg.deletedFrom) return;

        updateMessage(id, { status: msg.deletedFrom });
        loadMessages();
    };

    const filtered = messages.filter(
        (m) =>
            m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.body.toLowerCase().includes(search.toLowerCase()) ||
            m.recipients.join(", ").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search messages..."
                                className="pl-10 w-80 h-9 bg-background/50"
                            />
                        </div>
                    </div>
                </CardTitle>
                <CardDescription>Manage your {status} messages.</CardDescription>
            </CardHeader>
            <CardContent>
                {filtered.length === 0 ? (
                    <p className="text-gray-500 text-sm">No messages.</p>
                ) : (
                    <ul className="space-y-2">
                        {filtered.map((msg) => (
                            <li
                                key={msg.id}
                                className="p-2 border rounded-md bg-white flex justify-between items-center 
                                       hover:bg-gray-50 transform transition duration-200 ease-in-out cursor-pointer shadow-sm"
                                onClick={() => setViewing(msg)}
                            >
                                <div className="space-y-1">
                                    <p className="font-semibold">{msg.subject}</p>
                                    <p className="text-sm text-gray-600">{msg.body.slice(0, 80)}...</p>
                                    <p className="text-xs text-gray-400">{msg.recipients.join(", ")} • {new Date(msg.date).toLocaleString()}</p>
                                </div>
                                <div className="flex space-x-2">
                                    {status !== "trash" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(msg.id);
                                            }}
                                            className="text-xs bg-red-500 text-white rounded-full hover:bg-red-600 h-8 w-8 flex justify-center items-center"
                                        >
                                            <Trash2Icon className="h-5 w-5" />
                                        </button>
                                    )}
                                    {status === "trash" && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(msg.id);
                                                }}
                                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMessage(msg.id); // permanently delete
                                                    loadMessages();
                                                }}
                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete Forever
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            {viewing && (
                <ViewEmail
                    message={viewing}
                    onClose={() => setViewing(null)}
                    refresh={loadMessages} // reload messages if deleted/moved
                />
            )}

        </Card>
    );
};

export default MessagesTab;
