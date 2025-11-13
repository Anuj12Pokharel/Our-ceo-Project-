import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { usePersonalization } from "@/hooks/use-personalization";
import { personalizationAPI } from "@/lib/personalization-api";
import {
    Palette,
    Upload,
    Save,
    RotateCcw,
    Eye,
    Sidebar,
    Image as ImageIcon,
    CheckCircle,
    X
} from "lucide-react";

const Personalization = () => {
    const { settings, updateSettings, resetSettings } = usePersonalization();
    const [isDragging, setIsDragging] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const { toast } = useToast();

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file (PNG, JPG, SVG)",
                variant: "destructive",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
                title: "File too large",
                description: "Please upload an image smaller than 5MB",
                variant: "destructive",
            });
            return;
        }

        try {
            // Call mock API for logo upload
            const result = await personalizationAPI.uploadLogo(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                updateSettings({ customLogo: e.target?.result as string });
                toast({
                    title: "Logo uploaded successfully",
                    description: result.message,
                });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Failed to upload logo. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Save settings
    const saveSettings = async () => {
        try {
            // Save to localStorage
            localStorage.setItem('personalization-settings', JSON.stringify(settings));

            // Call mock API
            const result = await personalizationAPI.saveSettings(settings);

            toast({
                title: "Settings saved",
                description: result.message,
            });
        } catch (error) {
            toast({
                title: "Error saving settings",
                description: "Failed to save your personalization settings",
                variant: "destructive",
            });
        }
    };

    // Handle setting changes
    const handleSettingChange = async (key: keyof typeof settings, value: any) => {
        updateSettings({ [key]: value });

        // Validate color scheme when primary colors change
        if (key === 'primaryColor' || key === 'primaryHoverColor') {
            try {
                const validation = await personalizationAPI.validateColorScheme(
                    key === 'primaryColor' ? value : settings.primaryColor,
                    key === 'primaryHoverColor' ? value : settings.primaryHoverColor
                );

                if (!validation.valid && validation.suggestions) {
                    toast({
                        title: "Color scheme warning",
                        description: validation.suggestions[0],
                        variant: "destructive",
                    });
                }
            } catch (error) {
                // Silently fail validation
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Personalization</h2>
                    <p className="text-muted-foreground">
                        Customize the appearance of your dashboard with colors, logos, and styling options.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* <Button
                        variant="outline"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        {previewMode ? 'Hide Preview' : 'Show Preview'}
                    </Button> */}
                    <Button
                        variant="outline"
                        onClick={async () => {
                            try {
                                await personalizationAPI.resetSettings();
                                resetSettings();
                                toast({
                                    title: "Settings reset",
                                    description: "All personalization settings have been reset to defaults",
                                });
                            } catch (error) {
                                toast({
                                    title: "Error resetting settings",
                                    description: "Failed to reset settings",
                                    variant: "destructive",
                                });
                            }
                        }}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                    <Button
                        onClick={saveSettings}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Settings
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Customization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Color Customization
                        </CardTitle>
                        <CardDescription>
                            Customize the primary colors and sidebar appearance
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    type="text"
                                    value={settings.primaryColor}
                                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                                    placeholder="#0ea5e9"
                                />
                            </div>
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="primaryHoverColor">Primary Hover Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primaryHoverColor"
                                    type="color"
                                    value={settings.primaryHoverColor}
                                    onChange={(e) => handleSettingChange('primaryHoverColor', e.target.value)}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    type="text"
                                    value={settings.primaryHoverColor}
                                    onChange={(e) => handleSettingChange('primaryHoverColor', e.target.value)}
                                    placeholder="#0284c7"
                                />
                            </div>
                        </div> */}

                        {/* <Separator /> */}

                        <div className="space-y-2">
                            <Label htmlFor="sidebarBackground">Sidebar Background</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sidebarBackground"
                                    type="color"
                                    value={settings.sidebarBackground}
                                    onChange={(e) => handleSettingChange('sidebarBackground', e.target.value)}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    type="text"
                                    value={settings.sidebarBackground}
                                    onChange={(e) => handleSettingChange('sidebarBackground', e.target.value)}
                                    placeholder="#f8fafc"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sidebarTextColor">Sidebar Text Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="sidebarTextColor"
                                    type="color"
                                    value={settings.sidebarTextColor}
                                    onChange={(e) => handleSettingChange('sidebarTextColor', e.target.value)}
                                    className="w-16 h-10 p-1"
                                />
                                <Input
                                    type="text"
                                    value={settings.sidebarTextColor}
                                    onChange={(e) => handleSettingChange('sidebarTextColor', e.target.value)}
                                    placeholder="#1e293b"
                                />
                            </div>
                        </div>


                    </CardContent>
                </Card>

                {/* Logo Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Custom Logo
                        </CardTitle>
                        <CardDescription>
                            Upload your own logo to replace the default one
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop your logo here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                Supports PNG, JPG, SVG (max 5MB)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Recommended resolution 2080 x 553
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                className="hidden"
                                id="logo-upload"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                                Choose File
                            </Button>
                        </div>

                        {settings.customLogo && (
                            <div className="space-y-2">
                                <Label>Current Logo Preview</Label>
                                <div className="relative inline-block">
                                    <img
                                        src={settings.customLogo}
                                        alt="Custom logo"
                                        className="h-12 w-auto object-contain border rounded"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                        onClick={() => handleSettingChange('customLogo', null)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Additional Customization */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sidebar className="w-5 h-5" />
                            Additional Customization
                        </CardTitle>
                        <CardDescription>
                            Fine-tune the appearance with additional options
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="borderRadius">Border Radius (px)</Label>
                            <Input
                                id="borderRadius"
                                type="number"
                                min="0"
                                max="24"
                                value={settings.borderRadius}
                                onChange={(e) => handleSettingChange('borderRadius', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Shadows</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add subtle shadows to cards and buttons
                                </p>
                            </div>
                            <Switch
                                checked={settings.enableShadows}
                                onCheckedChange={(checked) => handleSettingChange('enableShadows', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Enable Animations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Smooth transitions and hover effects
                                </p>
                            </div>
                            <Switch
                                checked={settings.enableAnimations}
                                onCheckedChange={(checked) => handleSettingChange('enableAnimations', checked)}
                            />
                        </div>
                    </CardContent>
                </Card> */}

                {/* Preview Card */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                        <CardDescription>
                            See how your changes look in real-time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Button className="w-full">Primary Button</Button>
                            <Button variant="outline" className="w-full">Secondary Button</Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg bg-sidebar">
                            <p className="text-sidebar-foreground text-sm">
                                Sidebar preview with custom colors
                            </p>
                        </div>

                        <div className="p-4 bg-card border rounded-lg shadow-card">
                            <p className="text-card-foreground text-sm">
                                Card with custom styling
                            </p>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
};

export default Personalization;
