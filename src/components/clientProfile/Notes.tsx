import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Edit, Save, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface NotesProps {
    initialNote?: string;
}

const Notes: React.FC<NotesProps> = ({ initialNote = "" }) => {
    const [note, setNote] = useState(initialNote);
    const [isEditing, setIsEditing] = useState(false);
    const [tempNote, setTempNote] = useState(initialNote);

    const handleSave = () => {
        setNote(tempNote);
        setIsEditing(false);
    };

    return (
        <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Notes and commentary</CardDescription>
                </div>
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center gap-1"
                    >
                        <Save size={18} /> Save Note
                    </button>
                ) : note ? (
                    <button
                        onClick={() => {
                            setTempNote(note);
                            setIsEditing(true);
                        }}
                        className="bg-primary text-white p-2 rounded hover:bg-primary-hover flex items-center gap-1"
                    >
                        <Edit size={18} /> Edit Note
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setTempNote("");
                            setIsEditing(true);
                        }}
                        className="bg-primary text-white p-2 rounded hover:bg-primary-hover flex items-center gap-1"
                    >
                        <Plus size={18} /> Add Note
                    </button>
                )}
            </CardHeader>

            <CardContent>
                {isEditing ? (
                    <Editor
                        apiKey="36oqxy2e3s8qt7lc05aksixmaqbqi2vrex6dc64gawiusvw4"
                        value={tempNote}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins:
                                "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons accordion",
                            toolbar:
                                "undo redo | insertTagButton | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | lineheight outdent indent | link image | table media | forecolor backcolor | charmap",
                            toolbar_mode: "wrap",
                            setup: (editor) => {
                                editor.ui.registry.addMenuButton("insertTagButton", {
                                    text: "Insert Tag",
                                    fetch: (callback) => {
                                        const items = [
                                            { type: "menuitem", text: "{{name}}", onAction: () => editor.insertContent("{{name}}") },
                                            { type: "menuitem", text: "{{email}}", onAction: () => editor.insertContent("{{email}}") },
                                        ];
                                        callback(items);
                                    },
                                });
                            },
                            images_upload_handler: (blobInfo, success, failure) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(blobInfo.blob());
                                reader.onload = () => success(reader.result as string);
                                reader.onerror = () => failure("Image upload failed");
                            },
                        }}
                        onEditorChange={(content) => setTempNote(content)}
                    />
                ) : note ? (
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: note }} />
                ) : (
                    <p className="text-gray-500">No notes added yet.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default Notes;
