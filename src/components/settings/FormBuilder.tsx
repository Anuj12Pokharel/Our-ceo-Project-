import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { FloatingInput } from "../ui/FloatingInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChevronDown, ChevronUp, TimerResetIcon, Trash2Icon } from "lucide-react";
import Swal from "sweetalert2";

type InputType =
    | "Text"
    | "Textarea"
    | "Select"
    | "Date"
    | "Radio"
    | "Checkbox"
    | "Password"
    | "Email";

type FormField = {
    id: string;
    label: string;
    type: InputType;
    isRequired: boolean;
    isEmailInput?: boolean;
    minLength?: number;
    maxLength?: number;
    minDate?: string; // ISO string
    maxDate?: string; // ISO string
    selectOptions?: string[];
    radioOptions?: string[];
    checkboxOptions?: string[];
};

type FormData = {
    id: string;
    name: string;
    description: string;
    fields: FormField[];
    status: "draft" | "published";
};

const INPUT_TYPES: InputType[] = [
    "Text",
    "Textarea",
    "Select",
    "Date",
    "Radio",
    "Checkbox",
    "Password",
    "Email",
];

function generateId() {
    return Math.random().toString(36).slice(2, 9);
}

export const FormBuilder = () => {
    const [forms, setForms] = useState<FormData[]>([]);
    const [editingForm, setEditingForm] = useState<FormData | null>(null);
    // For options input controlled state
    const [selectInput, setSelectInput] = React.useState("");
    const [radioInput, setRadioInput] = React.useState("");
    // Track collapsed state for each field
    const [collapsedFields, setCollapsedFields] = useState<Set<string>>(new Set());

    // New field default
    const newEmptyField = (): FormField => ({
        id: generateId(),
        label: "",
        type: "Text",
        isRequired: false,
        isEmailInput: false,
        minLength: undefined,
        maxLength: undefined,
        minDate: undefined,
        maxDate: undefined,
        selectOptions: [],
        radioOptions: [],
        checkboxOptions: [],
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("formBuilderForms");
        if (saved) {
            setForms(JSON.parse(saved));
        }
    }, []);

    // Save forms to localStorage whenever forms change
    useEffect(() => {
        localStorage.setItem("formBuilderForms", JSON.stringify(forms));
    }, [forms]);

    // Add new empty field to form
    const addField = () => {
        if (!editingForm) return;
        setEditingForm({
            ...editingForm,
            fields: [...editingForm.fields, newEmptyField()],
        });
    };

    // Remove field by id
    const removeField = (fieldId: string) => {
        if (!editingForm) return;
        setEditingForm({
            ...editingForm,
            fields: editingForm.fields.filter((f) => f.id !== fieldId),
        });
    };

    // Update field property
    const updateField = (
        fieldId: string,
        key: keyof FormField,
        value: any
    ) => {
        if (!editingForm) return;
        setEditingForm({
            ...editingForm,
            fields: editingForm.fields.map((f) =>
                f.id === fieldId ? { ...f, [key]: value } : f
            ),
        });
    };

    const moveField = (index: number, direction: "up" | "down") => {
        setEditingForm((prev) => {
            if (!prev || !prev.fields) return prev;

            const newFields = [...prev.fields];

            // Calculate the new position
            const newIndex = direction === "up" ? index - 1 : index + 1;

            // Prevent out-of-bounds movement
            if (newIndex < 0 || newIndex >= newFields.length) {
                return prev;
            }

            // Swap positions
            const temp = newFields[index];
            newFields[index] = newFields[newIndex];
            newFields[newIndex] = temp;

            return { ...prev, fields: newFields };
        });
    };

    // Toggle field collapse state
    const toggleFieldCollapse = (fieldId: string) => {
        setCollapsedFields(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fieldId)) {
                newSet.delete(fieldId);
            } else {
                newSet.add(fieldId);
            }
            return newSet;
        });
    };

    // Handle adding option tag for select/radio options on comma or enter
    const handleAddOption = (
        fieldId: string,
        key: "selectOptions" | "radioOptions" | "checkboxOptions",
        inputValue: string,
        setInputValue: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (!editingForm) return;
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        // Split by comma if user pasted multiple
        const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);

        const field = editingForm.fields.find((f) => f.id === fieldId);
        if (!field) return;

        const currentOptions = field[key] || [];
        const newOptions = [...currentOptions];

        parts.forEach((part) => {
            if (!newOptions.includes(part)) {
                newOptions.push(part);
            }
        });

        updateField(fieldId, key, newOptions);
        setInputValue("");
    };

    // Remove option tag from select/radio options
    const removeOption = (
        fieldId: string,
        key: "selectOptions" | "radioOptions" | "checkboxOptions",
        option: string
    ) => {
        if (!editingForm) return;
        const field = editingForm.fields.find((f) => f.id === fieldId);
        if (!field) return;
        const updatedOptions = (field[key] || []).filter((opt) => opt !== option);
        updateField(fieldId, key, updatedOptions);
    };

    // Add new form
    const addNewForm = () => {
        const newForm: FormData = {
            id: generateId(),
            name: "",
            description: "",
            fields: [],
            status: "draft",
        };
        setEditingForm(newForm);
    };

    // Save draft (update or add)
    const saveDraft = () => {
        if (!editingForm) return;

        // Ensure status is "draft" when saving draft
        const draftForm = { ...editingForm, status: "draft" };

        setForms((prev) => {
            const exists = prev.find((f) => f.id === draftForm.id);
            if (exists) {
                // update existing
                return prev.map((f) => (f.id === draftForm.id ? draftForm : f));
            } else {
                // add new
                return [...prev, draftForm];
            }
        });
        setEditingForm(null);
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Draft Saved Locally",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
        });
    };

    // Publish form (set status to published)
    const publishForm = () => {
        if (!editingForm) return;

        const updatedForm = { ...editingForm, status: "published" };

        setEditingForm(updatedForm);
        setForms((prev) => {
            const exists = prev.find((f) => f.id === updatedForm.id);
            if (exists) {
                return prev.map((f) => (f.id === updatedForm.id ? updatedForm : f));
            } else {
                return [...prev, updatedForm];
            }
        });
        setEditingForm(null);
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Form Published Locally",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingForm(null);
    };

    // Prepare and console log API data
    const submitFormToApi = () => {
        if (!editingForm) return;
        // Here prepare data exactly how your backend expects
        console.log("Ready to submit form data to API:", editingForm);
    };

    // Live form preview - just render fields using FloatingInput
    // We'll fake react-hook-form for preview with minimal functionality:
    const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

    const handlePreviewChange = (name: string, value: any) => {
        setPreviewValues((prev) => ({ ...prev, [name]: value }));
    };

    // Initialize preview values for checkbox groups
    const getPreviewValue = (field: FormField) => {
        if (field.type === "Checkbox" && field.checkboxOptions && field.checkboxOptions.length > 0) {
            return previewValues[field.id] ?? [];
        }
        return previewValues[field.id] ?? "";
    };

    // Validate field value and return error message
    const validateField = (field: FormField, value: any): string | undefined => {
        if (value && typeof value === 'string') {
            if (field.minLength && value.length < field.minLength) {
                return `Minimum length is ${field.minLength} characters`;
            }
            if (field.maxLength && value.length > field.maxLength) {
                return `Maximum length is ${field.maxLength} characters`;
            }
        }

        if (field.type === "Date" && value) {
            const dateValue = new Date(value);
            if (field.minDate && dateValue < new Date(field.minDate)) {
                return `Date must be after ${new Date(field.minDate).toLocaleDateString()}`;
            }
            if (field.maxDate && dateValue > new Date(field.maxDate)) {
                return `Date must be before ${new Date(field.maxDate).toLocaleDateString()}`;
            }
        }

        return undefined;
    };

    // Render editor UI for each field property
    const renderFieldEditor = (field: FormField, index: number) => {
        const isLast = index === editingForm.fields.length - 1;
        const isFirst = index === 0;
        const isCollapsed = collapsedFields.has(field.id);

        return (
            <div
                key={field.id}
                className="border overflow-hidden rounded mb-4 bg-white shadow-sm transition-all duration-300 ease-in-out z-9"
                style={{
                    transform: `translateY(0px)`,
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                {/* Collapsible Header */}
                <div
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => toggleFieldCollapse(field.id)}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">
                                {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            </span>
                            <span className="font-semibold text-gray-800">
                                {field.label || "(No Label)"} - {field.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Move buttons */}
                            {editingForm.fields.length > 1 && (
                                <>
                                    {!isFirst && (
                                        <span
                                            className="border border-gray-300 rounded p-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveField(index, 'up');
                                            }}
                                            title="Move up"
                                        >
                                            <ChevronUp size={16} />
                                        </span>
                                    )}
                                    {!isLast && (
                                        <span
                                            className="border border-gray-300 rounded p-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveField(index, 'down');
                                            }}
                                            title="Move down"
                                        >
                                            <ChevronDown size={16} />
                                        </span>
                                    )}
                                </>
                            )}
                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeField(field.id);
                                }}
                                className="text-red-500 hover:bg-red-200 border border-red-500 rounded p-1 bg-red-100 transition-colors duration-200"
                                title="Remove field"
                            >
                                <Trash2Icon size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collapsible Content */}
                <div
                    className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
                        }`}
                >
                    <div className="p-4 flex flex-col gap-3">
                        <FloatingInput
                            id={`label-${field.id}`}
                            label="Label"
                            name={`label-${field.id}`}
                            type="text"
                            selected={field.label}
                            cursor="text"
                            register={undefined}
                            // We control manually
                            {...{
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateField(field.id, "label", e.target.value),
                                value: field.label,
                            }}
                        />

                        <FloatingInput
                            id={`type-${field.id}`}
                            label="Input Type"
                            name={`type-${field.id}`}
                            type="select"
                            selectTxt="Select input type"
                            options={INPUT_TYPES}
                            selected={field.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                updateField(field.id, "type", e.target.value as InputType)
                            }
                            }
                        />

                        <div className="flex space-x-4">
                            <FloatingInput
                                id={`isRequired-${field.id}`}
                                label="Required"
                                name={`isRequired-${field.id}`}
                                type="checkbox"
                                value={!!field.isRequired}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log('Required checkbox changed:', e.target.checked);
                                    updateField(field.id, "isRequired", e.target.checked)
                                }
                                }
                            />
                        </div>

                        {(field.type === "Text" ||
                            field.type === "Textarea" ||
                            field.type === "Password" ||
                            field.type === "Email") && (
                                <div className="flex space-x-4 mt-3">
                                    <FloatingInput
                                        id={`minLength-${field.id}`}
                                        label="Min Length"
                                        name={`minLength-${field.id}`}
                                        type="text"
                                        value={field.minLength?.toString() || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateField(
                                                field.id,
                                                "minLength",
                                                e.target.value ? Number(e.target.value) : undefined
                                            )
                                        }
                                    />

                                    <FloatingInput
                                        id={`maxLength-${field.id}`}
                                        label="Max Length"
                                        name={`maxLength-${field.id}`}
                                        type="text"

                                        value={field.maxLength?.toString() || ""}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            updateField(
                                                field.id,
                                                "maxLength",
                                                e.target.value ? Number(e.target.value) : undefined
                                            )
                                        }
                                    />
                                </div>
                            )}

                        {field.type === "Date" && (
                            <div className="flex space-x-4 mt-3">
                                <FloatingInput
                                    id={`minDate-${field.id}`}
                                    label="Min Date"
                                    name={`minDate-${field.id}`}
                                    type="date"
                                    value={field.minDate || ""}
                                    onChange={(date) => {
                                        updateField(field.id, "minDate", `${new Date(date).toLocaleDateString()}` || undefined)
                                    }}
                                />
                                <FloatingInput
                                    id={`maxDate-${field.id}`}
                                    label="Max Date"
                                    name={`maxDate-${field.id}`}
                                    type="date"
                                    value={field.maxDate || ""}
                                    onChange={(date) => {
                                        updateField(field.id, "maxDate", `${new Date(date).toLocaleDateString()}` || undefined)
                                    }}
                                />
                            </div>
                        )}

                        {(field.type === "Select" || field.type === "Radio") && (
                            <div className="mt-3">
                                <label className="block font-semibold mb-1 text-[0.9rem]">
                                    {field.type === "Select" ? "Select Options" : "Radio Options"}
                                </label>
                                <OptionsInput
                                    options={field.type === "Select" ? field.selectOptions ?? [] : field.radioOptions ?? []}
                                    onAdd={(val, clearInput) =>
                                        handleAddOption(
                                            field.id,
                                            field.type === "Select" ? "selectOptions" : "radioOptions",
                                            val,
                                            clearInput
                                        )
                                    }
                                    onRemove={(opt) =>
                                        removeOption(
                                            field.id,
                                            field.type === "Select" ? "selectOptions" : "radioOptions",
                                            opt
                                        )
                                    }
                                />
                            </div>
                        )}

                        {field.type === "Checkbox" && (
                            <div className="mt-3">
                                <label className="block font-semibold mb-1 text-[0.9rem]">
                                    Checkbox Options
                                </label>
                                <OptionsInput
                                    options={field.checkboxOptions ?? []}
                                    onAdd={(val, clearInput) =>
                                        handleAddOption(
                                            field.id,
                                            "checkboxOptions",
                                            val,
                                            clearInput
                                        )
                                    }
                                    onRemove={(opt) =>
                                        removeOption(
                                            field.id,
                                            "checkboxOptions",
                                            opt
                                        )
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Component for comma-separated tags input for options
    const OptionsInput = ({
        options,
        onAdd,
        onRemove,
    }: {
        options: string[];
        onAdd: (value: string, clearInput: React.Dispatch<React.SetStateAction<string>>) => void;
        onRemove: (option: string) => void;
    }) => {
        const [inputValue, setInputValue] = useState("");

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "," || e.key === "Enter") {
                e.preventDefault();
                if (inputValue.trim()) {
                    onAdd(inputValue, setInputValue);
                }
            }
        };

        return (
            <>
                <div className="flex flex-wrap gap-1 mb-1">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className="flex items-center bg-blue-100 text-black px-2 rounded text-sm gap-1"
                        >
                            {opt}
                            <button
                                type="button"
                                onClick={() => onRemove(opt)}
                                className="ml-1 text-black hover:text-blue-900 font-bold"
                                title="Remove option"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type and press comma or enter"
                    className="w-full border rounded px-2 py-2 text-[0.8rem]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </>
        );
    };

    // Render live form preview inputs with basic controlled inputs
    const renderPreviewField = (field: FormField) => {
        // Props for FloatingInput
        const commonProps = {
            label: field.label || "",
            id: field.id,
            name: field.id,
            type: field.type.toLowerCase() === "email" && field.isEmailInput ? "email" : field.type.toLowerCase(),
            selectTxt: field.type.toLowerCase() === "select" ? "Select option" : undefined,
            options: field.type.toLowerCase() === "select" ? field.selectOptions : undefined,
            rows: field.type.toLowerCase() === "textarea" ? 6 : undefined,
            minDate: field.type.toLowerCase() === "date" ? (field.minDate ? new Date(field.minDate) : undefined) : undefined,
            maxDate: field.type.toLowerCase() === "date" ? (field.maxDate ? new Date(field.maxDate) : undefined) : undefined,
            value: previewValues[field.id] ?? "",
            error: validateField(field, previewValues[field.id]) ? { message: validateField(field, previewValues[field.id])! } : undefined,
            onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | Date
            ) => {
                let val: any;

                if (field.type.toLowerCase() === "checkbox" && "target" in e) {
                    val = (e.target as HTMLInputElement).checked;
                }
                else if (field.type.toLowerCase() === "date") {
                    if (e instanceof Date) {
                        val = e.toLocaleString(); // YYYY-MM-DD format
                    } else if ("target" in e) {
                        val = (e.target as HTMLInputElement).value;
                    }
                }
                else if ("target" in e) {
                    val = e.target.value;
                }

                handlePreviewChange(field.id, val);
            }
        };

        // For radio/checkbox render using FloatingInput with group options
        if (field.type === "Radio" && field.radioOptions?.length) {
            const error = validateField(field, previewValues[field.id]);
            return (
                <div key={field.id} className="mb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {field.label || "(No Label)"}
                        </label>
                        {field.radioOptions.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt}
                                    checked={getPreviewValue(field) === opt}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handlePreviewChange(field.id, e.target.value);
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                        ))}
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </div>
                </div>
            );
        }

        if (field.type === "Checkbox" && field.checkboxOptions?.length) {
            const error = validateField(field, previewValues[field.id]);
            return (
                <div key={field.id} className="mb-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            {field.label || "(No Label)"}
                        </label>
                        {field.checkboxOptions.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name={field.id}
                                    value={opt}
                                    checked={Array.isArray(getPreviewValue(field)) && getPreviewValue(field).includes(opt)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const currentValues = Array.isArray(getPreviewValue(field)) ? getPreviewValue(field) : [];
                                        const checkboxValue = e.target.value;
                                        let newValues;

                                        if (e.target.checked) {
                                            newValues = [...currentValues, checkboxValue];
                                        } else {
                                            newValues = currentValues.filter(val => val !== checkboxValue);
                                        }

                                        handlePreviewChange(field.id, newValues);
                                    }}
                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                        ))}
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </div>
                </div>
            );
        }

        // For single checkbox without options, render simple checkbox
        if (field.type === "Checkbox" && (!field.checkboxOptions || field.checkboxOptions.length === 0)) {
            const error = validateField(field, previewValues[field.id]);
            return (
                <div key={field.id} className="mb-4">
                    <FloatingInput
                        label={field.label || "(No Label)"}
                        id={field.id}
                        name={field.id}
                        type="checkbox"
                        value={!!previewValues[field.id]}
                        error={error ? { message: error } : undefined}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handlePreviewChange(field.id, e.target.checked);
                        }}
                    />
                </div>
            );
        }

        // Default render FloatingInput for others
        return (
            <div key={field.id} className="mb-4">
                <FloatingInput {...commonProps} />
            </div>
        );
    };

    // Render form list
    const renderFormList = () => {
        if (forms.length === 0)
            return <p className="text-gray-600">No forms available. Add new form.</p>;

        return (
            <ul className="space-y-3">
                {forms.map((form) => (
                    <li
                        key={form.id}
                        className={clsx(
                            "p-3 border rounded cursor-pointer hover:bg-gray-100 border-gray-300 flex items-center justify-between"
                        )}
                        onClick={() => setEditingForm(form)}
                        title={form.status === "published" ? "Published" : "Draft"}
                    >
                        <div>
                            <h3 className="font-semibold text-lg">{form.name || "(Untitled Form)"}</h3>
                            <p className="text-sm text-gray-500">{form.description || "No description"}</p>
                        </div>
                        <p
                            className={clsx(
                                "text-xs inline-block px-3 py-1 border rounded-[48px] select-none capitalize",
                                form.status === "published"
                                    ? "bg-green-100 text-green-600 border-green-400"
                                    : "bg-gray-100 text-gray-600 border-gray-300"
                            )}
                        >
                            {form.status}
                        </p>
                    </li>
                ))}
            </ul>
        );
    };

    // Main render
    return (
        <>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .field-item {
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    .field-item:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                `}
            </style>
            <Card>
                <CardHeader>
                    <CardTitle>Form Builder</CardTitle>
                    <CardDescription>
                        Used to customize form fields across the app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mx-auto">
                        {!editingForm ? (
                            <>
                                {renderFormList()}
                                <button className="mt-5 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded" onClick={addNewForm} >
                                    + Add New Form
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Left editor col */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <FloatingInput
                                            id="formName"
                                            label="Form Name"
                                            name="formName"
                                            type="text"
                                            selected={editingForm.name}
                                            cursor="text"
                                            value={editingForm.name}
                                            onChange={(e) =>
                                                setEditingForm({ ...editingForm, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <FloatingInput
                                            id="formDescription"
                                            label="Short Description"
                                            name="formDescription"
                                            type="text"
                                            selected={editingForm.description}
                                            cursor="text"
                                            value={editingForm.description}
                                            onChange={(e) =>
                                                setEditingForm({ ...editingForm, description: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold mb-2 text-lg">Fields</h2>
                                        {editingForm.fields.length === 0 && (
                                            <p className="text-gray-600 mb-2">No fields yet. Add one below.</p>
                                        )}
                                        {editingForm.fields.map((field, index) => (
                                            <div
                                                key={`${field.id}-${index}`}
                                                className="field-item transition-all duration-500 ease-in-out transform z-9"
                                                style={{
                                                    animation: 'slideIn 0.3s ease-out'
                                                }}
                                            >
                                                {renderFieldEditor(field, index)}
                                            </div>
                                        ))}
                                        <button
                                            className="mt-2 px-3 py-1 bg-primary text-[0.8rem] text-white rounded hover:bg-primary-hover"
                                            onClick={addField}
                                        >
                                            + Add Field
                                        </button>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        <button
                                            onClick={saveDraft}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-[0.8rem] text-white px-3 py-1 rounded"
                                        >
                                            Draft
                                        </button>
                                        <button
                                            onClick={publishForm}
                                            className="bg-green-700 hover:bg-green-800 text-[0.8rem] text-white px-4 py-1 rounded"
                                        >
                                            Publish
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-400 hover:bg-gray-500 text-[0.8rem] text-white px-4 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                        {/* <button
                                        onClick={submitFormToApi}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-auto"
                                    >
                                        Submit API (console.log)
                                    </button> */}
                                    </div>
                                </div>

                                {/* Right preview col */}
                                <div className="
                                        w-full
                                        md:w-[30%]
                                        lg:w-[40%]
                                        p-4 rounded overflow-y-auto max-h-screen
                                        border border-gray-200 shadow-sm bg-white
                                    ">
                                    <h2 className="text-lg font-semibold mb-4">Live Form Preview</h2>
                                    {editingForm.fields.length === 0 && (
                                        <p className="text-gray-600">No fields to preview</p>
                                    )}
                                    {editingForm.fields.map((field) => renderPreviewField(field))}
                                </div>

                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}