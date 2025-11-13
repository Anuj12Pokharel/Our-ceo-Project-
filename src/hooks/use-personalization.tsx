import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface PersonalizationSettings {
    primaryColor: string;
    primaryHoverColor: string;
    sidebarBackground: string;
    sidebarTextColor: string;
    customLogo: string | null;
    borderRadius: number;
    enableShadows: boolean;
    enableAnimations: boolean;
}

interface PersonalizationContextType {
    settings: PersonalizationSettings;
    updateSettings: (newSettings: Partial<PersonalizationSettings>) => void;
    resetSettings: () => void;
    applySettings: (settings: PersonalizationSettings) => void;
    isIndexPage: boolean;
}

const defaultSettings: PersonalizationSettings = {
    primaryColor: "#2bace2",
    primaryHoverColor: "#68c5ed",
    sidebarBackground: "#202326",
    sidebarTextColor: "#ffffff",
    customLogo: null,
    borderRadius: 12,
    enableShadows: true,
    enableAnimations: true,
};

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export const PersonalizationProvider = ({ children, isIndexPage = false }: { children: ReactNode; isIndexPage?: boolean }) => {
    const [settings, setSettings] = useState<PersonalizationSettings>(defaultSettings);

    // Convert hex color to HSL
    const hexToHSL = (hex: string): string => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply settings to CSS variables
    const applySettings = (newSettings: PersonalizationSettings) => {
        // Don't apply personalization settings on Index page
        if (isIndexPage) {
            return;
        }

        const root = document.documentElement;

        // Convert hex to HSL for primary colors
        const primaryHSL = hexToHSL(newSettings.primaryColor);
        const sidebarBgHSL = hexToHSL(newSettings.sidebarBackground);
        const sidebarTextHSL = hexToHSL(newSettings.sidebarTextColor);

        // Create a lighter hover by increasing lightness
        const [h, s, l] = primaryHSL.split(" ").map((v, i) =>
            i === 0 ? parseFloat(v) : parseFloat(v.replace("%", ""))
        );
        const hoverL = Math.min(l + 15, 100); // lighten by 15%
        const primaryHoverHSL = `${h} ${s}% ${hoverL}%`;

        root.style.setProperty('--primary', primaryHSL);
        root.style.setProperty('--primary-hover', primaryHoverHSL);
        root.style.setProperty('--sidebar-background', sidebarBgHSL);
        root.style.setProperty('--sidebar-foreground', sidebarTextHSL);
        root.style.setProperty('--radius', `${newSettings.borderRadius}px`);

        // Apply shadows and animations
        if (!newSettings.enableShadows) {
            root.style.setProperty('--shadow-elegant', 'none');
            root.style.setProperty('--shadow-card', 'none');
            root.style.setProperty('--shadow-focus', 'none');
            // Disable all shadows globally
            root.style.setProperty('--shadow-sm', 'none');
            root.style.setProperty('--shadow-md', 'none');
            root.style.setProperty('--shadow-lg', 'none');
            root.style.setProperty('--shadow-xl', 'none');
            document.body.classList.add('no-shadows-enabled');
        } else {
            root.style.setProperty('--shadow-elegant', '0 4px 20px -4px hsl(var(--primary) / 0.15)');
            root.style.setProperty('--shadow-card', '0 2px 10px -2px hsl(var(--primary) / 0.1)');
            root.style.setProperty('--shadow-focus', '0 0 0 3px hsl(var(--primary) / 0.2)');
            // Restore default shadows
            root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
            root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)');
            root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)');
            root.style.setProperty('--shadow-xl', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)');
            document.body.classList.remove('no-shadows-enabled');
        }

        if (!newSettings.enableAnimations) {
            root.style.setProperty('--transition-smooth', 'none');
            root.style.setProperty('--transition-fast', 'none');
            // Disable all animations globally
            root.style.setProperty('--animate-duration', '0s');
            root.style.setProperty('--animate-delay', '0s');
            document.body.classList.add('no-animations-enabled');
        } else {
            root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
            root.style.setProperty('--transition-fast', 'all 0.15s ease-out');
            // Restore default animations
            root.style.setProperty('--animate-duration', '1s');
            root.style.setProperty('--animate-delay', '0s');
            document.body.classList.remove('no-animations-enabled');
        }

        localStorage.setItem('personalization-settings', JSON.stringify(newSettings));
    };

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('personalization-settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                const mergedSettings = { ...defaultSettings, ...parsed };
                setSettings(mergedSettings);
                applySettings(mergedSettings);
            } catch (error) {
                console.error('Error loading personalization settings:', error);
            }
        }
    }, [isIndexPage]);

    // Update settings
    const updateSettings = (newSettings: Partial<PersonalizationSettings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        applySettings(updatedSettings);
    };

    // Reset settings
    const resetSettings = () => {
        localStorage.removeItem('personalization-settings');
        setSettings(defaultSettings);
        applySettings(defaultSettings);
    };

    const value: PersonalizationContextType = {
        settings,
        updateSettings,
        resetSettings,
        applySettings,
        isIndexPage,
    };

    return (
        <PersonalizationContext.Provider value={value}>
            {children}
        </PersonalizationContext.Provider>
    );
};

export const usePersonalization = () => {
    const context = useContext(PersonalizationContext);
    if (context === undefined) {
        throw new Error('usePersonalization must be used within a PersonalizationProvider');
    }
    return context;
};
