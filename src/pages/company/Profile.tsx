import React, { useState, useEffect } from "react";
// Utility to get enabled fields for a company (demo: companyId = 1)
function getEnabledFields(companyId = 1) {
    const settings = localStorage.getItem(`fieldSettings_${companyId}`);
    if (!settings) return null;
    try {
        const categories = JSON.parse(settings);
        const enabledFields = {};
        categories.forEach((cat: any) => {
            cat.fields.forEach((field: any) => {
                if (field.enabled) enabledFields[field.id] = true;
            });
        });
        return enabledFields;
    } catch {
        return null;
    }
}
import { useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { Camera, User, Mail, Phone, Shield, Lock, Eye, EyeOff, Check, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Swal from "sweetalert2";

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    profilePicture?: File | null;
}

export default function Profile() {
    // For demo, assume companyId = 1
    const companyId = 1;
    const [enabledFields, setEnabledFields] = useState<any | null>(null);

    useEffect(() => {
        setEnabledFields(getEnabledFields(companyId));
    }, []);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileFormData>({
        defaultValues: {
            name: "John Doe",
            email: "j.doe@ourceo.com",
            phone: "9812345678",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            profilePicture: null,
        },
    });

    const [profilePreview, setProfilePreview] = useState<string>(
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400"
    );

    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setValue("profilePicture", file);

            // Simulate upload delay
            setTimeout(() => {
                setProfilePreview(URL.createObjectURL(file));
                setIsUploading(false);
            }, 1500);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Final Form Data:", data);
            setIsSaving(false);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Profile Details Updated",
                showConfirmButton: false,
                timer: 1500,
            });
        }, 2000);
    };

    // If field settings exist, only show enabled fields
    // Otherwise, show all fields (default)
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <span>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>Manage your account information and security preferences with ease</CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <div className="w-full">
                        <div className="space-y-8">
                            <div className="space-y-12">
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center space-y-6 mt-5">
                                    <div className="relative group">
                                        <div className="relative">
                                            <img
                                                src={profilePreview}
                                                alt="Profile"
                                                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl transform group-hover:scale-105 transition-all duration-300"
                                            />
                                            <label
                                                htmlFor="profilePicture"
                                                className="absolute bottom-2 right-2 bg-sidebar text-sidebar-foreground p-3 rounded-full cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 group"
                                            >
                                                {isUploading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <Camera size={20} />
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id="profilePicture"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-medium text-gray-800">Update Profile Picture</p>
                                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                            <Upload size={16} />
                                            Click camera icon to upload a new photo
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                    <div className="flex gap-10 justify-between flex-wrap">
                                        {/* Enhanced Profile Information Section */}
                                        <div className="relative flex-1 min-w-full md:min-w-[400px]">
                                            <div className="absolute -inset-1 rounded-2xl opacity-20 blur"></div>
                                            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="flex items-center justify-center w-12 h-12 bg-sidebar rounded-xl shadow-lg">
                                                        <User className="w-6 h-6 text-sidebar-foreground" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Personal Information</h2>
                                                        <p className="text-gray-500 text-[0.7rem] md:text-[1rem]">Update your basic profile details</p>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {(!enabledFields || enabledFields["name"]) && (
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                <User size={16} />
                                                                Full Name
                                                            </label>
                                                            <FloatingInput
                                                                id="name"
                                                                label=""
                                                                name="name"
                                                                register={register}
                                                                rules={{ required: "Full Name is required" }}
                                                                error={errors.name}
                                                            />
                                                        </div>
                                                    )}
                                                    {(!enabledFields || enabledFields["phone"]) && (
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                <Phone size={16} />
                                                                Phone
                                                            </label>
                                                            <FloatingInput
                                                                id="phone"
                                                                label=""
                                                                name="phone"
                                                                register={register}
                                                                rules={{ required: "Phone is required" }}
                                                                error={errors.phone}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {(!enabledFields || enabledFields["email"]) && (
                                                    <div className="mt-6 space-y-2">
                                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                            <Mail size={16} />
                                                            Email Address
                                                        </label>
                                                        <div className="relative">
                                                            <FloatingInput
                                                                id="email"
                                                                label=""
                                                                name="email"
                                                                register={register}
                                                                error={errors.email}
                                                                // @ts-ignore
                                                                inputProps={{ disabled: true }}
                                                            />
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                                <Check size={12} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enhanced Security Section */}
                                        <div className="relative flex-1 min-w-full md:min-w-[400px]">
                                            <div className="absolute -inset-1 rounded-2xl opacity-20 blur"></div>
                                            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100/50">
                                                <div className="flex items-center justify-between gap-4 mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center justify-center w-12 h-12 bg-sidebar rounded-xl shadow-lg">
                                                            <Shield className="w-6 h-6 text-sidebar-foreground" />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-lg md:text-2xl font-bold text-gray-900">Security Settings</h2>
                                                            <p className="text-gray-500 text-[0.7rem] md:text-[1rem]">Manage your password and account security</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant={showPasswordSection ? "destructive" : "outline"}
                                                    size="sm"
                                                    onClick={() => setShowPasswordSection((prev) => !prev)}
                                                    className="transform transition-all duration-200 w-full"
                                                    style={{
                                                        marginBottom: showPasswordSection ? '10px' : 0
                                                    }}
                                                >
                                                    <Lock size={16} className="mr-2" />
                                                    {showPasswordSection ? "Cancel" : "Change Password"}
                                                </Button>

                                                {showPasswordSection && (
                                                    <div className="space-y-6 animate-slide-down">
                                                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                                            <div className="flex items-start gap-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900 mb-2">Password Requirements</h3>
                                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                                        <li>• At least 8 characters long</li>
                                                                        <li>• Include uppercase and lowercase letters</li>
                                                                        <li>• At least one number and special character</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-6">
                                                            <div className="relative">
                                                                <FloatingInput
                                                                    id="currentPassword"
                                                                    label="Current Password"
                                                                    type={showCurrentPassword ? "text" : "password"}
                                                                    name="currentPassword"
                                                                    register={register}
                                                                    error={errors.currentPassword}
                                                                />
                                                            </div>

                                                            <div className="relative">
                                                                <FloatingInput
                                                                    id="newPassword"
                                                                    label="New Password"
                                                                    type={showNewPassword ? "text" : "password"}
                                                                    name="newPassword"
                                                                    register={register}
                                                                    error={errors.newPassword}
                                                                />
                                                            </div>

                                                            <div className="relative">
                                                                <FloatingInput
                                                                    id="confirmPassword"
                                                                    label="Confirm New Password"
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    name="confirmPassword"
                                                                    register={register}
                                                                    error={errors.confirmPassword}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Save Button */}
                                    <div className="pt-8">
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-8 py-3 text-lg font-semibold shadow-xl transform transition-all duration-300 min-w-[160px] bg-primary hover:bg-primary-hover"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={20} className="mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-down {
                    from { opacity: 0; height: 0; }
                    to { opacity: 1; height: auto; }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.4s ease-out;
                }
            `}</style>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}