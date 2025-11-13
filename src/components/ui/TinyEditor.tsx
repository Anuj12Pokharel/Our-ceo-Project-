import React from "react";
import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

const tinymceKey = import.meta.env.VITE_TINY_MCE;

interface TinyMCEEditorProps {
    name: string;
    control: any;
    isMessageInput?: boolean;
}

export const TinyEditor: React.FC<TinyMCEEditorProps> = ({ name, control, isMessageInput = false }) => {
    // Dynamic toolbar
    const toolbar = isMessageInput
        ? "undo redo | insertTagButton"
        : "undo redo | insertTagButton | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | lineheight outdent indent | link image | table media | forecolor backcolor | charmap";

    const plugins = isMessageInput
        ? "preview importcss autolink"
        : "preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons accordion";

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Editor
                    key={isMessageInput ? "message" : "full"}
                    apiKey={tinymceKey}
                    value={field.value}
                    init={{
                        height: 600,
                        menubar: false,
                        plugins,
                        toolbar,
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
                    onEditorChange={(content) => field.onChange(content)}
                />
            )}
        />
    );
};
