import React, { useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Attachment {
    file: File;
    preview: string;
    type: "image" | "pdf";
    name: string;
    uploadedAt: string;
}

const Attachments: React.FC = () => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [tempFile, setTempFile] = useState<Attachment | null>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const acceptedTypes = ["application/pdf", "image/png", "image/jpeg"];
        const file = files[0];

        if (!acceptedTypes.includes(file.type)) {
            Swal.fire({
                icon: "error",
                title: "Invalid file type",
                text: "Only PDF, PNG, JPG, and JPEG files are allowed.",
            });
            return;
        }

        const preview =
            file.type.startsWith("image") ? URL.createObjectURL(file) : "";

        setTempFile({
            file,
            preview,
            type: file.type === "application/pdf" ? "pdf" : "image",
            name: file.name.replace(/\.[^/.]+$/, ""),
            uploadedAt: new Date().toLocaleString(),
        });
    };

    const handleSaveFile = () => {
        if (tempFile) {
            setAttachments((prev) => [...prev, tempFile]);
            setTempFile(null);
            setIsDialogOpen(false);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "File Added",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
            });
        }
    };

    const confirmDelete = (index: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This attachment will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it",
        }).then((result) => {
            if (result.isConfirmed) {
                setAttachments((prev) => prev.filter((_, i) => i !== index));
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "File deleted",
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                });
            }
        });
    };

    return (
        <Card className="shadow-card">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>Attachments</CardTitle>
                    <CardDescription>Upload and manage your files</CardDescription>
                </div>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-1"
                >
                    <Plus size={18} /> Add
                </Button>
            </CardHeader>

            <CardContent>
                {attachments.length === 0 ? (
                    <p className="text-gray-500">No attachments added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {attachments.map((att, idx) => (
                            <div
                                key={idx}
                                className="flex items-center border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition group min-w-0"
                            >
                                {/* Clickable preview area */}
                                <div
                                    className="flex flex-1 items-center cursor-pointer min-w-0"
                                    onClick={() => {
                                        if (att.type === "image") {
                                            setLightboxIndex(idx);
                                        } else {
                                            window.open(URL.createObjectURL(att.file), "_blank");
                                        }
                                    }}
                                >
                                    {/* Thumbnail */}
                                    {att.type === "image" ? (
                                        <img
                                            src={att.preview}
                                            alt={att.name}
                                            className="h-14 w-14 object-cover rounded flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 flex items-center justify-center bg-red-100 rounded flex-shrink-0">
                                            <FileText size={26} className="text-red-600" />
                                        </div>
                                    )}

                                    {/* File info */}
                                    <div className="ml-4 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                                            {att.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{att.uploadedAt}</p>
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={() => confirmDelete(idx)}
                                    className="ml-3 text-gray-400 hover:text-red-600 transition flex-shrink-0"
                                    aria-label={`Delete ${att.name}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>


            {/* Upload Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload Attachment</DialogTitle>
                    </DialogHeader>

                    {!tempFile && (
                        <div
                            className="border-2 border-dashed border-gray-400 rounded-lg py-20 px-10 text-center cursor-pointer hover:border-gray-600 transition"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFileSelect(e.dataTransfer.files);
                            }}
                            onClick={() => {
                                const input = document.getElementById(
                                    "fileInput"
                                ) as HTMLInputElement;
                                input.click();
                            }}
                        >
                            <p className="text-gray-500">
                                Drag & drop a file here, or click to select
                            </p>

                            <p className="text-gray-400 text-[14px]">
                                Only pdf, png, jpg and jpeg are allowed
                            </p>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>
                    )}

                    {tempFile && (
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-4">
                                {tempFile.type === "image" ? (
                                    <img
                                        src={tempFile.preview}
                                        alt="preview"
                                        className="h-16 w-16 object-cover rounded"
                                    />
                                ) : (
                                    <FileText size={40} className="text-red-500" />
                                )}
                                <div className="flex-1">
                                    <Input
                                        value={tempFile.name}
                                        onChange={(e) =>
                                            setTempFile({ ...tempFile, name: e.target.value })
                                        }
                                        placeholder="Enter file name"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {tempFile.uploadedAt}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setTempFile(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveFile}>Save</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    open={lightboxIndex !== null}
                    close={() => setLightboxIndex(null)}
                    slides={attachments
                        .filter((a) => a.type === "image")
                        .map((a) => ({ src: a.preview }))}
                    index={attachments
                        .filter((a) => a.type === "image")
                        .findIndex(
                            (img) => img.preview === attachments[lightboxIndex]?.preview
                        )}
                />
            )}
        </Card>
    );
};

export default Attachments;
