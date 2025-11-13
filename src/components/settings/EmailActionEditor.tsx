import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { TinyEditor } from "../ui/TinyEditor";
import { WorkflowAction } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChartBar } from "lucide-react";

// LocalStorage Email Templates
const EMAIL_STORAGE_KEY = "email_templates";
const MESSAGE_STORAGE_KEY = "sms_templates";

type EmailActionEditorProps = {
    action: WorkflowAction;
    onSave: (updatedAction: Partial<WorkflowAction>) => void;
    onCancel: () => void;
    isMessageInput?: boolean;
    templateType?: "email" | "message";
};

export const EmailActionEditor: React.FC<EmailActionEditorProps> = ({
    action,
    onSave,
    onCancel,
    isMessageInput = false,
    templateType
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<WorkflowAction>({
        defaultValues: action,
    });

    const getEmailTemplates = () => {
        try {
            const stored = localStorage.getItem(templateType === "email" ? EMAIL_STORAGE_KEY : MESSAGE_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    };

    const [templates, setTemplates] = useState(getEmailTemplates());

    const selectedTo = watch("to") || [];

    const fromOptions = ["User", "User 2", "User 3"];
    const toOptions = [
        { group: "User Group", items: ["Applicants", "Persons", "Users"] },
        {
            group: "Individuals",
            items: [
                "Alice Smith",
                "Bob Johnson",
                "Charlie Brown",
                "Diana Prince",
                "Ethan Hunt",
                "Fiona Gallagher",
                "George Clooney",
            ],
        },
    ];

    const handleSave = (data: WorkflowAction) => {
        onSave(data);
    };

    const handleSelectTemplate = (template: any) => {
        // Prefill values into form
        if (template.from) setValue("from", template.from);
        if (template.to) setValue("to", template.to);
        if (template.subject) setValue("subject", template.subject);
        if (template.body) setValue("body", template.body);
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem(
                templateType === "email" ? EMAIL_STORAGE_KEY : MESSAGE_STORAGE_KEY
            );
            setTemplates(stored ? JSON.parse(stored) : []);
        } catch {
            setTemplates([]);
        }
    }, [templateType]);

    return (
        <form className="bg-white space-y-4">
            {/* Select Template Button */}
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                            <ChartBar />
                            Select Template
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {templates.length === 0 ? (
                            <DropdownMenuItem disabled>No templates available</DropdownMenuItem>
                        ) : (
                            templates.map((t: any) => (
                                <DropdownMenuItem key={t.id} onClick={() => handleSelectTemplate(t)}>
                                    {t.title}
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* From */}
            <FloatingInput
                label="From"
                id="from"
                name="from"
                type="select"
                options={fromOptions}
                register={register}
                rules={{ required: "From is required" }}
                error={errors.from}
            />

            {/* To */}
            <FloatingInput
                label="To"
                id="to"
                name="to"
                type="select"
                options={toOptions}
                value={selectedTo}
                onChange={(e) => setValue("to", e.target.value)}
                rules={{ required: "To is required" }}
                error={errors.to}
                allowMultiple
                showAsBars
            />

            {/* Subject */}
            {!isMessageInput && (
                <FloatingInput
                    label="Subject"
                    id="subject"
                    name="subject"
                    type="text"
                    register={register}
                    rules={{ required: false }}
                    error={errors.subject}
                />
            )}

            {/* Body */}
            <div>
                <TinyEditor name="body" control={control} isMessageInput={isMessageInput} />
            </div>

            {/* Save Button */}
            <Button type="button" onClick={handleSubmit(handleSave)} className="mt-2">
                Save
            </Button>
        </form>
    );
};
