import { BookText, FileText, Image, Paperclip, Sheet } from "lucide-react";
import React from "react";

interface FileItem {
    name: string;
    url?: string;
}

interface EmailMessage {
    id: string;
    from?: string;
    recipients?: string[];
    subject?: string;
    body?: string;
    attachments?: FileItem[];
    date?: string;
}

interface ViewEmailProps {
    message: EmailMessage | null;
    onClose: () => void;
}

// File icon helper
const fileIcon = (file: FileItem) => {
    if (!file?.name) return <Paperclip />;
    const ext = file.name.split(".").pop()?.toLowerCase();
    switch (ext) {
        case "pdf":
            return <FileText />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return <Image />;
        case "doc":
        case "docx":
            return <BookText />;
        case "xls":
        case "xlsx":
            return <Sheet />;
        default:
            return <Paperclip />;
    }
};

const ViewEmail: React.FC<ViewEmailProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-md w-[90%] max-w-3xl p-6 relative shadow-lg animate-fade-in">
                {/* Close button */}
                <button
                    className="absolute right-5 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Email header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold">{message.subject || "No Subject"}</h2>
                    <p className="text-sm text-gray-400">
                        From: {message.from || "Unknown"} | To: {(message.recipients || []).join(", ")} | {new Date(message.date).toLocaleString("en-AU", { hour: 'numeric', minute: 'numeric', hour12: true, year: 'numeric', month: '2-digit', day: '2-digit' }).replace(',', '') || ""}
                    </p>
                </div>

                {/* Email body */}
                <div className="mb-4">
                    <p className="whitespace-pre-line text-sm text-gray-800">{message.body || "No content"}</p>
                </div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Attachments</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {message.attachments.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="border rounded-md p-2 flex flex-col items-center justify-center relative bg-gray-50 hover:bg-gray-100"
                                >
                                    <span className="text-3xl">{fileIcon(file)}</span>
                                    <p className="text-xs mt-1 truncate w-full text-center">{file.name}</p>
                                    {file.url && (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0"
                                        ></a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewEmail;
