import { useRef, useState } from "react";
import { Paperclip, X, File, FileImage, FileText, FileVideo, FileAudio } from "lucide-react";

type AttachmentsInputProps = {
    value: File[];
    onChange: (files: File[]) => void;
};

const AttachmentsInput = ({ value, onChange }: AttachmentsInputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        onChange([...(value || []), ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (file: File) => {
        onChange(value.filter((f) => f !== file));
    };

    const getFileIcon = (file: File) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        switch (ext) {
            case "pdf":
                return <FileText className="text-red-500" size={24} />;
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "svg":
                return <FileImage className="text-green-500" size={24} />;
            case "txt":
            case "doc":
            case "docx":
                return <FileText className="text-blue-500" size={24} />;
            default:
                return <File size={24} />;
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    return (
        <div className="space-y-2">
            {/* Hidden input */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Drag & Drop Area */}
            <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer p-6 text-center transition-all ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
                    }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <Paperclip size={28} className="mb-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">
                    {dragging ? "Drop files here..." : "Click or drag files to attach"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Supported formats: pdf, doc, txt, images</p>
            </div>

            {/* Files List */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {value.map((file) => (
                        <div
                            key={file.name + file.size + file.lastModified}
                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg w-[200px] hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center gap-2 truncate">
                                {getFileIcon(file)}
                                <span className="truncate">{file.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(file)}
                                className="text-gray-500 hover:text-red-600"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AttachmentsInput;
