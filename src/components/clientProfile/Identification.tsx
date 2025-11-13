import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, DeleteIcon, Plus, Trash2Icon } from "lucide-react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { useForm, FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Swal from "sweetalert2";

type DocumentType = "License" | "Citizenship";

type DocumentField = {
    label: string;
    name: string;
    type?: string;
    options?: string[];
    dateMode?: "default" | "dob" | "expiry";
};

type DocumentData = {
    type: DocumentType;
    data: Record<string, any>;
};

const documentFieldMap: Record<DocumentType, DocumentField[]> = {
    License: [
        { label: "Driver’s Licence Number", name: "licenseNumber" },
        { label: "Name on Document", name: "documentName" },
        {
            label: "Original or Certified",
            name: "certified",
            type: "select",
            options: ["Original", "Certified Copy"],
        },
        { label: "License Card Number", name: "cardNumber" },
        { label: "Date of Issue", name: "licenseIssued", type: "date" },
        { label: "Expiry Date", name: "expiryDate", type: "date", dateMode: 'expiry' },
        { label: "Document Issued By", name: "issuedBy" },
    ],
    Citizenship: [
        { label: "Citizenship Number", name: "citizenshipNumber" },
        { label: "Issued District", name: "citizenshipDistrict" },
    ],
};

// Default mock entries
const initialDocuments: DocumentData[] = [
    {
        type: "License",
        data: {
            licenseNumber: "NSW1234567",
            documentName: "Rijan Neupane",
            certified: "Original",
            cardNumber: "A789456123",
            licenseIssued: "2021-01-10",
            expiryDate: "2026-01-09",
            issuedBy: "NSW Gov",
        },
    },
    {
        type: "Citizenship",
        data: {
            citizenshipNumber: "CITZ202301",
            citizenshipDistrict: "Sydney",
        },
    },
];

const Identification = () => {
    const [documents, setDocuments] = useState<DocumentData[]>(initialDocuments);
    const [activeDocType, setActiveDocType] = useState<DocumentType | null>(null);
    const [activeDocIndex, setActiveDocIndex] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm();

    const handleAddDocument = (type: DocumentType) => {
        reset();
        setActiveDocType(type);
        setActiveDocIndex(null);
    };

    const onSubmit = (data: any) => {
        const newDoc: DocumentData = {
            type: activeDocType as DocumentType,
            data,
        };

        if (activeDocIndex !== null) {
            const updated = [...documents];
            updated[activeDocIndex] = newDoc;
            setDocuments(updated);
        } else {
            setDocuments((prev) => [...prev, newDoc]);
        }

        reset();
        setActiveDocType(null);
        setActiveDocIndex(null);
    };

    const handleEdit = (index: number) => {
        const doc = documents[index];
        setActiveDocType(doc.type);
        setActiveDocIndex(index);
        reset(doc.data);
    };

    const handleDeleteDocument = (index: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This document will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
                setActiveDocType(null);
                setActiveDocIndex(null);
                reset();

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Document deleted",
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
                    <CardTitle>Identification</CardTitle>
                    <CardDescription>
                        Identification Information of a client
                    </CardDescription>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="gap-2 self-start mt-2 md:mt-6">
                            <Plus size={16} />
                            Add New
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 p-2">
                        {(["License", "Citizenship"] as DocumentType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleAddDocument(type)}
                                className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                            >
                                {type}
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className={cn("space-y-2", !activeDocType && "md:col-span-2")}>
                    {documents.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No documents added.</p>
                    ) : (
                        documents.map((doc, idx) => {
                            const displayField = documentFieldMap[doc.type][0]?.name;
                            return (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 border rounded-md hover:bg-muted cursor-pointer"
                                    onClick={() => handleEdit(idx)}
                                >
                                    <div>
                                        <p className="font-medium">{doc.type}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {doc.data[displayField]}
                                        </p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(idx);
                                        }}
                                    >
                                        <ChevronRightIcon />
                                    </Button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* RIGHT COLUMN */}
                {activeDocType && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 border rounded-md p-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-medium mb-2">
                                {activeDocIndex !== null ? "Edit" : "Add"} {activeDocType}
                            </h3>
                            <span
                                onClick={() => {
                                    if (activeDocIndex !== null) {
                                        handleDeleteDocument(activeDocIndex);
                                    }
                                }}
                                className="
                                            inline-flex items-center justify-center
                                            w-10 h-10 rounded-full
                                            shadow-sm
                                            bg-white
                                            hover:shadow-md hover:bg-gray-100
                                            cursor-pointer transition
                                        "
                            >
                                <Trash2Icon color="#f00000" />
                            </span>
                        </div>

                        {documentFieldMap[activeDocType].map((field) => (
                            <FloatingInput
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                label={field.label}
                                type={field.type || "text"}
                                options={field.options}
                                selectTxt="Select Option"
                                register={register}
                                rules={{ required: `${field.label} is required` }}
                                error={errors[field.name] as FieldError}
                                setValue={setValue}
                                watch={watch}
                                dateMode={field?.dateMode || 'default'}
                            />
                        ))}

                        <Button type="submit" className="w-full">
                            {activeDocIndex !== null ? "Update" : "Add"} Document
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default Identification;
