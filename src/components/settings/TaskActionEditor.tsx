import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { WorkflowAction } from "@/types/types";

const TASK_TEMPLATE_STORAGE_KEY = "task_templates";

type TaskTemplate = {
    id: string;
    title: string;
    comments?: string;
    tasks?: {
        id: string;
        subject: string;
        type: string;
        owner: string;
        delegate: string;
        priority: string;
        offset: string;
        offsetDependency?: string;
    }[];
};

type TaskActionForm = WorkflowAction & {
    templateId?: string; // stores the selected template id
    comment?: string;
};

type TaskActionEditorProps = {
    action: WorkflowAction;
    onSave: (updatedAction: Partial<WorkflowAction>) => void;
    onCancel: () => void;
};

export const TaskActionEditor: React.FC<TaskActionEditorProps> = ({
    action,
    onSave,
    onCancel,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TaskActionForm>({
        defaultValues: {
            ...action,
            templateId: (action as any)?.templateId ?? "",
            comment: (action as any)?.comment ?? "",
        },
    });

    const [templates] = useState<TaskTemplate[]>(() => {
        try {
            const raw = localStorage.getItem(TASK_TEMPLATE_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const templateId = watch("templateId");

    const selectedTemplate = useMemo(
        () => templates.find((t) => t.id === watch("templateId")),
        [templates, watch("templateId")]
    );

    console.log("Selected Template:", selectedTemplate);

    useEffect(() => {
        if (selectedTemplate?.comments) {
            setValue("comment", selectedTemplate.comments, { shouldDirty: true });
        }
    }, [selectedTemplate, setValue]);

    const handleSave = (data: TaskActionForm) => {
        onSave(data);
    };

    return (
        <form className="bg-white space-y-4">
            {/* Template Name (stores template id in templateId) */}
            <FloatingInput
                label="Template Name"
                id="templateId"
                name="templateId"
                type="select"
                selectTxt="Select template..."
                options={templates.map((t) => ({ label: t.title, value: t.id }))}
                onChange={(e) => setValue("templateId", e.target.value)}
                rules={{ required: "Template is required" }}
                error={errors.templateId as any}
            />

            {/* Comment */}
            <FloatingInput
                label="Comment"
                id="comment"
                name="comment"
                type="text"
                register={register}
                rules={{ required: false }}
                error={errors.comment as any}
            />

            {/* Task Template Items */}
            {selectedTemplate?.tasks?.length ? (
                <div className="border rounded-2xl p-4 bg-gray-50 shadow-sm">
                    <h4 className="font-semibold mb-3 text-base text-gray-800">
                        Task Items
                    </h4>
                    <div className="space-y-3">
                        {selectedTemplate.tasks.map((task, idx) => (
                            <div
                                key={task.id || idx}
                                className="p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                        {task.subject}
                                    </span>
                                    {task.type && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                        {task.type}
                                    </span>}
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                                    <p>
                                        <span className="font-medium">Owner:</span> {task.owner}
                                    </p>
                                    <p>
                                        <span className="font-medium">Delegate:</span> {task.delegate}
                                    </p>
                                    <p>
                                        <span className="font-medium">Priority:</span> {task.priority}
                                    </p>
                                    <p>
                                        <span className="font-medium">Offset:</span> {task.offset}
                                        {task.offsetDependency && (
                                            <span className="text-gray-500">
                                                {" "}
                                                after {task.offsetDependency}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 border rounded-xl text-sm text-gray-500 bg-gray-50">
                    No tasks available for this template.
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <Button type="button" onClick={handleSubmit(handleSave)}>
                    Save
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
