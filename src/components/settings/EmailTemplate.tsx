import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import Swal from 'sweetalert2';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { FloatingInput } from "../ui/FloatingInput";
import { TinyEditor } from "../ui/TinyEditor";
const tinymceKey = import.meta.env.VITE_TINY_MCE;

// Types
interface EmailTemplate {
    id: string;
    title: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

interface EmailData {
    title: string;
    from: string;
    to: string;
    subject: string;
    body: string;
}

// Storage utilities
const STORAGE_KEY = 'email_templates';

const emailStorage = {
    getAll: (): EmailTemplate[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    getById: (id: string): EmailTemplate | null => {
        const templates = emailStorage.getAll();
        return templates.find(template => template.id === id) || null;
    },

    save: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate => {
        const templates = emailStorage.getAll();
        const now = new Date().toISOString();

        const newTemplate: EmailTemplate = {
            ...template,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now,
        };

        templates.push(newTemplate);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return newTemplate;
    },

    update: (id: string, template: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): EmailTemplate | null => {
        const templates = emailStorage.getAll();
        const index = templates.findIndex(t => t.id === id);

        if (index === -1) return null;

        const updatedTemplate: EmailTemplate = {
            ...templates[index],
            ...template,
            updatedAt: new Date().toISOString(),
        };

        templates[index] = updatedTemplate;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return updatedTemplate;
    },

    delete: (id: string): boolean => {
        const templates = emailStorage.getAll();
        const filteredTemplates = templates.filter(template => template.id !== id);

        if (filteredTemplates.length === templates.length) return false;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates));
        return true;
    },
};

// Mock API functions
const emailApi = {
    publishTemplate: async (template: EmailTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Publishing email template:', template);
                resolve(true);
            }, 1000);
        });
    },

    saveDraft: async (template: EmailTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Saving draft:', template);
                resolve(true);
            }, 500);
        });
    },

    sendBulkEmail: async (template: EmailTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Sending bulk email:', template);
                resolve(true);
            }, 2000);
        });
    },
};

// Toast utility
const showToast = (title: string, text: string, icon: 'success' | 'error' | 'info' | 'warning') => {
    Swal.fire({
        title,
        text,
        icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
    });
};

const EmailTemplate: React.FC = () => {
    const [view, setView] = useState<'listing' | 'editor'>('listing');
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        watch,
        handleSubmit,
        register,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EmailData>({
        defaultValues: {
            title: "",
            from: "User",
            to: "Applicants",
            subject: "",
            body: "",
        },
    });

    const emailData = watch();

    // Options for select inputs
    const fromOptions = ["User", "User 2", "User 3"];
    const toOptions = ["Applicants", "Persons", "Users"];

    // Load templates on component mount
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = () => {
        const storedTemplates = emailStorage.getAll();
        setTemplates(storedTemplates);
    };

    const handleAddNew = () => {
        setEditingTemplate(null);
        reset({
            title: "",
            from: "User",
            to: "Applicants",
            subject: "",
            body: "",
        });
        setView('editor');
    };

    const handleEditTemplate = (template: EmailTemplate) => {
        setEditingTemplate(template);
        reset({
            title: template.title,
            from: template.from,
            to: template.to,
            subject: template.subject,
            body: template.body,
        });
        setView('editor');
    };

    const handleDeleteTemplate = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const success = emailStorage.delete(id);
            if (success) {
                loadTemplates();
                showToast('Deleted!', 'Email template has been deleted.', 'success');
            } else {
                showToast('Error!', 'Failed to delete email template.', 'error');
            }
        }
    };

    const handleSaveDraft = async (data: EmailData) => {
        if (!data.title.trim()) {
            showToast('Error!', 'Please enter a title for the template.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            let savedTemplate: EmailTemplate;

            if (editingTemplate) {
                savedTemplate = emailStorage.update(editingTemplate.id, {
                    ...data,
                    status: 'draft',
                }) as EmailTemplate;
            } else {
                savedTemplate = emailStorage.save({
                    ...data,
                    status: 'draft',
                });
            }

            await emailApi.saveDraft(savedTemplate);
            loadTemplates();
            setView('listing');
            showToast('Success!', 'Draft saved successfully.', 'success');
        } catch (error) {
            showToast('Error!', 'Failed to save draft.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (data: EmailData) => {
        if (!data.title.trim()) {
            showToast('Error!', 'Please enter a title for the template.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            let savedTemplate: EmailTemplate;

            if (editingTemplate) {
                savedTemplate = emailStorage.update(editingTemplate.id, {
                    ...data,
                    status: 'published',
                }) as EmailTemplate;
            } else {
                savedTemplate = emailStorage.save({
                    ...data,
                    status: 'published',
                });
            }

            await emailApi.publishTemplate(savedTemplate);
            loadTemplates();
            setView('listing');
            showToast('Success!', 'Email template published successfully.', 'success');
        } catch (error) {
            showToast('Error!', 'Failed to publish template.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setView('listing');
        setEditingTemplate(null);
        reset();
    };

    // Listing View
    if (view === 'listing') {
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Email Templates</CardTitle>
                            <CardDescription>
                                Used to create email template and send bulk emails.
                            </CardDescription>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[0.8rem] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            New Template
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    {templates.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No email templates</h3>
                            <p className="text-gray-400 text-[0.8rem] mb-4">Get started by creating your first email template.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 cursor-pointer" onClick={() => handleEditTemplate(template)}>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{template.title}</h3>
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-500">
                                                <p><span className="font-medium">Subject:</span> {template.subject || 'No subject'}</p>
                                                <div className="flex items-center gap-5">
                                                    <p><span className="font-bold">From:</span> {template.from}</p>
                                                    <p><span className="font-bold">To:</span> {template.to}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-400 flex gap-3 items-center">
                                                <p> Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                                                {template.updatedAt !== template.createdAt && (
                                                    <p>Updated: {new Date(template.updatedAt).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${template.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {template.status}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Editor View
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border rounded transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <CardTitle>
                                {editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
                            </CardTitle>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT: FORM */}
                    <div className="w-full lg:w-2/3 py-4 bg-white">
                        <form className="space-y-4">
                            {/* Title */}
                            <FloatingInput
                                label="Template Title"
                                id="title"
                                name="title"
                                type="text"
                                register={register}
                                rules={{ required: "Template title is required" }}
                                error={errors.title}
                            />

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
                                register={register}
                                rules={{ required: "To is required" }}
                                error={errors.to}
                            />

                            {/* Subject */}
                            <FloatingInput
                                label="Subject"
                                id="subject"
                                name="subject"
                                type="text"
                                register={register}
                                rules={{ required: false }}
                                error={errors.subject}
                            />

                            {/* Body */}
                            <div>
                                <TinyEditor
                                    name="body"
                                    control={control}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit(handleSaveDraft)}
                                    disabled={isLoading}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-[0.8rem] text-white px-3 py-1 rounded disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Draft'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit(handlePublish)}
                                    disabled={isLoading}
                                    className="bg-green-700 hover:bg-green-800 text-[0.8rem] text-white px-4 py-1 rounded disabled:opacity-50"
                                >
                                    {isLoading ? 'Publishing...' : 'Publish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="bg-gray-400 hover:bg-gray-500 text-[0.8rem] text-white px-4 py-1 rounded disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: GMAIL-LIKE PREVIEW */}
                    <div className="w-full lg:w-1/3 p-4 bg-gray-50 rounded-lg shadow overflow-auto mt-3">
                        {emailData.title ||
                            emailData.from ||
                            emailData.to ||
                            emailData.subject ||
                            emailData.body ? (
                            <>
                                <h1 className="text-lg font-semibold mb-3">Email Preview</h1>
                                <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-md shadow-sm">
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-200">
                                        <h1 className="text-lg font-semibold">{emailData.subject || 'No Subject'}</h1>
                                        <div className="mt-1 text-sm text-gray-900">
                                            <span className="font-medium"><b>From: </b>{emailData.from}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-900">
                                            <span className="font-medium"><b>To: </b>{emailData.to}</span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div
                                        className="p-6 prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: emailData.body }}
                                    />

                                    {/* Footer */}
                                    <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
                                        Note: This is an approximate preview and may differ slightly
                                        from the exact email.
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                                No Preview Available
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EmailTemplate;