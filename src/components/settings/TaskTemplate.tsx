import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { FloatingInput } from "../ui/FloatingInput";
import { TaskRow, TaskTemplate as TaskTemplateType, TaskTemplateData } from "@/types/types";

// ---------- Storage utilities ----------
const STORAGE_KEY = "task_templates";

const taskTemplateStorage = {
    getAll: (): TaskTemplateType[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return [];
        }
    },

    save: (
        template: Omit<TaskTemplateType, "id" | "createdAt" | "updatedAt">
    ): TaskTemplateType => {
        const templates = taskTemplateStorage.getAll();
        const now = new Date().toISOString();

        const newTemplate: TaskTemplateType = {
            ...template,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now,
        };

        templates.push(newTemplate);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return newTemplate;
    },

    update: (
        id: string,
        template: Partial<Omit<TaskTemplateType, "id" | "createdAt">>
    ): TaskTemplateType | null => {
        const templates = taskTemplateStorage.getAll();
        const index = templates.findIndex((t) => t.id === id);
        if (index === -1) return null;

        const updatedTemplate: TaskTemplateType = {
            ...templates[index],
            ...template,
            updatedAt: new Date().toISOString(),
        };

        templates[index] = updatedTemplate;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return updatedTemplate;
    },

    delete: (id: string): boolean => {
        const templates = taskTemplateStorage.getAll();
        const filtered = templates.filter((t) => t.id !== id);
        if (filtered.length === templates.length) return false;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    },
};

// ---------- Toast ----------
const showToast = (
    title: string,
    text: string,
    icon: "success" | "error" | "info" | "warning"
) => {
    Swal.fire({
        title,
        text,
        icon,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
    });
};

// ---------- Main Component ----------
const TaskTemplate: React.FC = () => {
    const [view, setView] = useState<"listing" | "editor">("listing");
    const [templates, setTemplates] = useState<TaskTemplateType[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<TaskTemplateType | null>(
        null
    );
    const [tasks, setTasks] = useState<TaskRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskTemplateData>({
        defaultValues: {
            title: "",
            opportunityType: "",
            comments: "",
        },
    });

    // Options for dropdowns
    const delegateOptions = ["User1", "User2", "Team A"];
    const ownerOptions = ["Owner1", "Owner2"];
    const dependencyOptions = ["None", "Task1", "Task2"];
    const typeOptions = ["Call", "Email", "Meeting"];
    const priorityOptions = ["Low", "Medium", "High"];

    // Load templates
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = () => {
        const stored = taskTemplateStorage.getAll();
        setTemplates(stored);
    };

    const handleAddNew = () => {
        setEditingTemplate(null);
        reset({ title: "", opportunityType: "", comments: "" });
        setTasks([]);
        setView("editor");
    };

    const handleEdit = (template: TaskTemplateType) => {
        setEditingTemplate(template);
        reset({
            title: template.title,
            opportunityType: template.opportunityType,
            comments: template.comments,
        });
        setTasks(template.tasks);
        setView("editor");
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const success = taskTemplateStorage.delete(id);
            if (success) {
                loadTemplates();
                showToast("Deleted!", "Task template deleted.", "success");
            }
        }
    };

    const handleAddTask = () => {
        const newTask: TaskRow = {
            id: Date.now().toString(),
            subject: "",
            delegate: "",
            owner: "",
            offset: "",
            offsetDependency: "",
            type: "",
            priority: "",
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    const handleTaskChange = (id: string, field: keyof TaskRow, value: string) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
        );
    };

    const saveTemplate = async (
        data: TaskTemplateData,
        status: "draft" | "published"
    ) => {
        if (!data.title.trim()) {
            showToast("Error!", "Please enter a title.", "error");
            return;
        }

        setIsLoading(true);
        try {
            let saved: TaskTemplateType;
            if (editingTemplate) {
                saved = taskTemplateStorage.update(editingTemplate.id, {
                    ...data,
                    tasks,
                    status,
                }) as TaskTemplateType;
            } else {
                saved = taskTemplateStorage.save({
                    ...data,
                    tasks,
                    status,
                });
            }

            loadTemplates();
            setView("listing");
            showToast(
                "Success!",
                status === "draft"
                    ? "Draft saved successfully."
                    : "Template published successfully.",
                "success"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setView("listing");
        setEditingTemplate(null);
        reset();
        setTasks([]);
    };

    // ---------- LISTING ----------
    if (view === "listing") {
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Task Templates</CardTitle>
                            <CardDescription>
                                Create reusable task templates for opportunities.
                            </CardDescription>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-primary text-white text-[0.8rem] px-4 py-2 rounded-md"
                        >
                            <Plus size={16} /> New Template
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    {templates.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">
                            No task templates yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="border rounded-md p-4 flex justify-between items-center cursor-pointer hover:shadow-md"
                                    onClick={() => handleEdit(template)}
                                >
                                    <div>
                                        <h3 className="font-semibold">{template.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {template.opportunityType}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${template.status === "published"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {template.status}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(template.id);
                                            }}
                                            className="p-2 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // ---------- EDITOR ----------
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 border rounded hover:bg-gray-100"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <CardTitle>
                        {editingTemplate ? "Edit Task Template" : "Create Task Template"}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <form className="space-y-4">
                    {/* Title */}
                    <FloatingInput
                        label="Template Title"
                        id="title"
                        name="title"
                        type="text"
                        register={register}
                        rules={{ required: "Title is required" }}
                        error={errors.title}
                    />

                    {/* Opportunity Type */}
                    <FloatingInput
                        label="Opportunity Type"
                        id="opportunityType"
                        name="opportunityType"
                        type="select"
                        options={["Loan", "Insurance", "Investment"]}
                        register={register}
                        rules={{ required: "Opportunity type is required" }}
                        error={errors.opportunityType}
                    />

                    {/* Comments */}
                    <FloatingInput
                        label="Comments"
                        id="comments"
                        name="comments"
                        type="textarea"
                        register={register}
                        rules={{ required: false }}
                        error={errors.comments}
                    />

                    {/* TASKS TABLE */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Tasks</h3>
                            <button
                                type="button"
                                onClick={handleAddTask}
                                className="flex items-center gap-2 text-sm text-primary"
                            >
                                <Plus size={14} /> Add Task
                            </button>
                        </div>
                        <table className="w-full border text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">Subject</th>
                                    <th className="p-2">Delegate</th>
                                    <th className="p-2">Owner</th>
                                    <th className="p-2">Offset</th>
                                    <th className="p-2">Offset Dep.</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Priority</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className="border-t w-full">
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={task.subject}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "subject", e.target.value)
                                                }
                                                className="border rounded p-1 w-full"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={task.delegate}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "delegate", e.target.value)
                                                }
                                                className="border rounded p-1 w-full"
                                            >
                                                <option value="">Select</option>
                                                {delegateOptions.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={task.owner}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "owner", e.target.value)
                                                }
                                                className="border rounded p-1 w-full"
                                            >
                                                <option value="">Select</option>
                                                {ownerOptions.map((o) => (
                                                    <option key={o} value={o}>
                                                        {o}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2 w-20">
                                            <input
                                                type="number"
                                                value={task.offset}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "offset", e.target.value)
                                                }
                                                className="border rounded p-1 w-20"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={task.offsetDependency}
                                                onChange={(e) =>
                                                    handleTaskChange(
                                                        task.id,
                                                        "offsetDependency",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded p-1 w-full"
                                            >
                                                <option value="">Select</option>
                                                {dependencyOptions.map((dep) => (
                                                    <option key={dep} value={dep}>
                                                        {dep}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={task.type}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "type", e.target.value)
                                                }
                                                className="border rounded p-1 w-full"
                                            >
                                                <option value="">Select</option>
                                                {typeOptions.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={task.priority}
                                                onChange={(e) =>
                                                    handleTaskChange(task.id, "priority", e.target.value)
                                                }
                                                className="border rounded p-1 w-full"
                                            >
                                                <option value="">Select</option>
                                                {priorityOptions.map((p) => (
                                                    <option key={p} value={p}>
                                                        {p}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleSubmit((data) => saveTemplate(data, "draft"))}
                            disabled={isLoading}
                            className="bg-yellow-500 text-white text-[0.8rem] px-2 py-1 rounded"
                        >
                            {isLoading ? "Saving..." : "Save Draft"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit((data) => saveTemplate(data, "published"))}
                            disabled={isLoading}
                            className="bg-green-600 text-white text-[0.8rem] px-2 py-1 rounded"
                        >
                            {isLoading ? "Publishing..." : "Publish"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-400 text-white text-[0.8rem] px-2 py-1 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default TaskTemplate;
