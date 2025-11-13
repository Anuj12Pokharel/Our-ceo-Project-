import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, ArrowLeft, Phone, MoreVertical, Paperclip, Send, Wifi, BatteryFull } from "lucide-react";
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

// Types
interface SmsTemplate {
    id: string;
    title: string;
    from: string;
    to: string;
    body: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}

interface SmsData {
    title: string;
    from: string;
    to: string;
    body: string;
}

// Storage utilities
const STORAGE_KEY = 'sms_templates';

const smsStorage = {
    getAll: (): SmsTemplate[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    },

    getById: (id: string): SmsTemplate | null => {
        const templates = smsStorage.getAll();
        return templates.find(template => template.id === id) || null;
    },

    save: (template: Omit<SmsTemplate, 'id' | 'createdAt' | 'updatedAt'>): SmsTemplate => {
        const templates = smsStorage.getAll();
        const now = new Date().toISOString();

        const newTemplate: SmsTemplate = {
            ...template,
            id: Date.now().toString(),
            createdAt: now,
            updatedAt: now,
        };

        templates.push(newTemplate);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return newTemplate;
    },

    update: (id: string, template: Partial<Omit<SmsTemplate, 'id' | 'createdAt'>>): SmsTemplate | null => {
        const templates = smsStorage.getAll();
        const index = templates.findIndex(t => t.id === id);

        if (index === -1) return null;

        const updatedTemplate: SmsTemplate = {
            ...templates[index],
            ...template,
            updatedAt: new Date().toISOString(),
        };

        templates[index] = updatedTemplate;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        return updatedTemplate;
    },

    delete: (id: string): boolean => {
        const templates = smsStorage.getAll();
        const filteredTemplates = templates.filter(template => template.id !== id);

        if (filteredTemplates.length === templates.length) return false;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates));
        return true;
    },
};

// Mock API functions
const smsApi = {
    publishTemplate: async (template: SmsTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Publishing SMS template:', template);
                resolve(true);
            }, 1000);
        });
    },

    saveDraft: async (template: SmsTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Saving SMS draft:', template);
                resolve(true);
            }, 500);
        });
    },

    sendBulkSms: async (template: SmsTemplate): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Sending bulk SMS:', template);
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

const SmsTemplate: React.FC = () => {
    const [view, setView] = useState<'listing' | 'editor'>('listing');
    const [templates, setTemplates] = useState<SmsTemplate[]>([]);
    const [editingSms, setEditingSms] = useState<SmsTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        watch,
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<SmsData>({
        defaultValues: {
            title: "",
            from: "User",
            to: "Applicants",
            body: "",
        },
    });

    const smsData = watch();

    const fromOptions = ["User", "User 2", "User 3"];
    const toOptions = ["Applicants", "Persons", "Users"];

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = () => {
        const storedTemplates = smsStorage.getAll();
        setTemplates(storedTemplates);
    };

    const handleAddNew = () => {
        setEditingSms(null);
        reset({
            title: "",
            from: "User",
            to: "Applicants",
            body: "",
        });
        setView('editor');
    };

    const handleEditTemplate = (template: SmsTemplate) => {
        setEditingSms(template);
        reset({
            title: template.title,
            from: template.from,
            to: template.to,
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
            const success = smsStorage.delete(id);
            if (success) {
                loadTemplates();
                showToast('Deleted!', 'SMS template has been deleted.', 'success');
            } else {
                showToast('Error!', 'Failed to delete SMS template.', 'error');
            }
        }
    };

    const handleSaveDraft = async (data: SmsData) => {
        if (!data.title.trim()) {
            showToast('Error!', 'Please enter a title for the template.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            let savedTemplate: SmsTemplate;

            if (editingSms) {
                savedTemplate = smsStorage.update(editingSms.id, {
                    ...data,
                    status: 'draft',
                }) as SmsTemplate;
            } else {
                savedTemplate = smsStorage.save({
                    ...data,
                    status: 'draft',
                });
            }

            await smsApi.saveDraft(savedTemplate);
            loadTemplates();
            setView('listing');
            showToast('Success!', 'Draft saved successfully.', 'success');
        } catch (error) {
            showToast('Error!', 'Failed to save draft.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async (data: SmsData) => {
        if (!data.title.trim()) {
            showToast('Error!', 'Please enter a title for the template.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            let savedTemplate: SmsTemplate;

            if (editingSms) {
                savedTemplate = smsStorage.update(editingSms.id, {
                    ...data,
                    status: 'published',
                }) as SmsTemplate;
            } else {
                savedTemplate = smsStorage.save({
                    ...data,
                    status: 'published',
                });
            }

            await smsApi.publishTemplate(savedTemplate);
            loadTemplates();
            setView('listing');
            showToast('Success!', 'SMS template published successfully.', 'success');
        } catch (error) {
            showToast('Error!', 'Failed to publish template.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setView('listing');
        setEditingSms(null);
        reset();
    };

    // Listing View
    if (view === 'listing') {
        return (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>SMS Templates</CardTitle>
                            <CardDescription>
                                Used to create SMS template and send bulk messages.
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No SMS templates</h3>
                            <p className="text-gray-400 text-[0.8rem] mb-4">Get started by creating your first SMS template.</p>
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

    const IosStatusBar: React.FC = () => {
        const [currentTime, setCurrentTime] = useState(
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            }, 60000);

            return () => clearInterval(interval);
        }, []);

        return (
            <div className="bg-gray-200 flex items-center justify-between px-2 py-1 pt-2 text-black text-xs font-medium relative">
                <p className="text-[0.4rem]">{currentTime}</p>
                <div className="absolute left-1/2 transform -translate-x-1/2 bg-black w-20 h-4 rounded-full shadow-md"></div>
                <div className="flex items-center space-x-1">
                    <Wifi className="w-3 h-3" />
                    <div className="flex items-center space-x-0.5">
                        <BatteryFull className="w-4 h-4" />
                    </div>
                </div>
            </div>
        );
    };

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
                                {editingSms ? 'Edit SMS Template' : 'Create SMS Template'}
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

                            {/* Body */}
                            <div>
                                <TinyEditor
                                    name="body"
                                    control={control}
                                    isMessageInput
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

                    {/* RIGHT: PREVIEW */}
                    <div className="w-full lg:w-1/3 p-4 bg-gray-50 rounded-lg shadow overflow-auto mt-3">
                        <h1 className="text-lg font-semibold mb-3">SMS Preview</h1>
                        <div className="mb-6">
                            <div className="relative mx-auto w-[210px] h-[420px] rounded-[2rem] border-[1px] border-black bg-black">
                                {/* Screen */}
                                <div className="absolute inset-0 m-[8px] rounded-[1.7rem] bg-white overflow-hidden">
                                    <IosStatusBar />
                                    {/* HEADER */}
                                    <div className="flex items-center justify-between bg-gray-200 text-black px-1 py-2 mt-[-6px]">
                                        {/* Left side */}
                                        <div className="flex items-center space-x-1">
                                            <ArrowLeft className="w-3 cursor-pointer" />
                                            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-black text-white text-[0.5rem] font-medium">
                                                O
                                            </div>
                                            <span className="text-[0.6rem]">OUR CEO</span>
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-2.5 cursor-pointer" />
                                            <MoreVertical className="w-2.5 cursor-pointer" />
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="h-[310px] overflow-y-auto bg-white p-2 space-y-2 scrollbar-hide">
                                        <div className="flex">
                                            <div className="max-w-[75%] bg-white text-gray-800 px-3 py-2 rounded-lg shadow text-[0.6rem]">
                                                <div dangerouslySetInnerHTML={{ __html: smsData.body }} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* BOTTOM INPUT BAR */}
                                    <div className="absolute bottom-0 flex items-center justify-between bg-white border-t px-2 py-0.5 pb-2 w-full">
                                        <Paperclip className="w-2.5 text-gray-500 mr-2 cursor-pointer" />
                                        <input
                                            type="text"
                                            placeholder="Message..."
                                            className="flex-1 px-2 py-1 rounded-full bg-gray-100 text-[0.5rem] focus:outline-none"
                                        />
                                        <Send className="ml-2 w-3 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SmsTemplate;
