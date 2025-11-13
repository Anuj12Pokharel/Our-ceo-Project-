// Mock API service for personalization settings
export interface PersonalizationSettings {
    primaryColor: string;
    primaryHoverColor: string;
    sidebarBackground: string;
    sidebarTextColor: string;
    customLogo: string | null;
    borderRadius: number;
    enableShadows: boolean;
    enableAnimations: boolean;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class PersonalizationAPI {
    private static instance: PersonalizationAPI;
    private baseURL = 'https://api.our-ceo.com/v1';

    private constructor() {}

    public static getInstance(): PersonalizationAPI {
        if (!PersonalizationAPI.instance) {
            PersonalizationAPI.instance = new PersonalizationAPI();
        }
        return PersonalizationAPI.instance;
    }

    /**
     * Save personalization settings to server
     */
    async saveSettings(settings: PersonalizationSettings): Promise<{ success: boolean; message: string }> {
        try {
            console.log('🌐 API Call: Saving personalization settings');
            console.log('📡 Endpoint:', `${this.baseURL}/personalization/settings`);
            console.log('📦 Request payload:', JSON.stringify(settings, null, 2));
            
            // Simulate network delay
            await delay(800);
            
            // Simulate server response
            const response = {
                success: true,
                message: 'Settings saved successfully',
                data: {
                    id: 'settings_' + Date.now(),
                    userId: 'user_123',
                    updatedAt: new Date().toISOString(),
                    settings: settings
                }
            };
            
            console.log('✅ API Response:', response);
            
            return {
                success: true,
                message: 'Settings saved successfully'
            };
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to save settings');
        }
    }

    /**
     * Load personalization settings from server
     */
    async loadSettings(): Promise<PersonalizationSettings | null> {
        try {
            console.log('🌐 API Call: Loading personalization settings');
            console.log('📡 Endpoint:', `${this.baseURL}/personalization/settings`);
            
            // Simulate network delay
            await delay(600);
            
            // Simulate server response with stored settings
            const storedSettings = localStorage.getItem('personalization-settings');
            if (storedSettings) {
                const settings = JSON.parse(storedSettings);
                console.log('✅ API Response: Found stored settings');
                console.log('📦 Response data:', settings);
                return settings;
            }
            
            console.log('✅ API Response: No stored settings found');
            return null;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to load settings');
        }
    }

    /**
     * Reset personalization settings to defaults
     */
    async resetSettings(): Promise<{ success: boolean; message: string }> {
        try {
            console.log('🌐 API Call: Resetting personalization settings');
            console.log('📡 Endpoint:', `${this.baseURL}/personalization/settings/reset`);
            
            // Simulate network delay
            await delay(500);
            
            console.log('✅ API Response: Settings reset successfully');
            
            return {
                success: true,
                message: 'Settings reset to defaults'
            };
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to reset settings');
        }
    }

    /**
     * Upload custom logo
     */
    async uploadLogo(file: File): Promise<{ success: boolean; url: string; message: string }> {
        try {
            console.log('🌐 API Call: Uploading custom logo');
            console.log('📡 Endpoint:', `${this.baseURL}/personalization/logo`);
            console.log('📦 File details:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            // Simulate network delay
            await delay(1200);
            
            // Simulate file upload response
            const response = {
                success: true,
                url: `https://cdn.our-ceo.com/logos/${Date.now()}_${file.name}`,
                message: 'Logo uploaded successfully'
            };
            
            console.log('✅ API Response:', response);
            
            return response;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to upload logo');
        }
    }

    /**
     * Get user preferences
     */
    async getUserPreferences(): Promise<{ theme: string; language: string; timezone: string }> {
        try {
            console.log('🌐 API Call: Loading user preferences');
            console.log('📡 Endpoint:', `${this.baseURL}/user/preferences`);
            
            // Simulate network delay
            await delay(400);
            
            const preferences = {
                theme: 'light',
                language: 'en',
                timezone: 'UTC'
            };
            
            console.log('✅ API Response:', preferences);
            
            return preferences;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to load user preferences');
        }
    }

    /**
     * Validate color scheme
     */
    async validateColorScheme(primaryColor: string, hoverColor: string): Promise<{ valid: boolean; suggestions?: string[] }> {
        try {
            console.log('🌐 API Call: Validating color scheme');
            console.log('📡 Endpoint:', `${this.baseURL}/personalization/validate-colors`);
            console.log('📦 Colors:', { primaryColor, hoverColor });
            
            // Simulate network delay
            await delay(300);
            
            // Simple validation logic
            const isValid = this.isValidColor(primaryColor) && this.isValidColor(hoverColor);
            const suggestions = isValid ? undefined : ['Consider using higher contrast colors for better accessibility'];
            
            const response = { valid: isValid, suggestions };
            
            console.log('✅ API Response:', response);
            
            return response;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error('Failed to validate color scheme');
        }
    }

    private isValidColor(color: string): boolean {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
    }
}

// Export singleton instance
export const personalizationAPI = PersonalizationAPI.getInstance();
