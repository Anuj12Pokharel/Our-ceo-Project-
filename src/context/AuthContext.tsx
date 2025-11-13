import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import CryptoJS from "crypto-js";

type User = {
    email: string;
    role: "admin" | "company" | "user";
};

type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Choose a secret key for encryption
const SECRET_KEY = "ceokey";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const encrypted = localStorage.getItem("authUser");
        if (encrypted) {
            try {
                const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
                const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                setUser(decrypted);
            } catch (err) {
                console.error("Failed to decrypt user:", err);
                localStorage.removeItem("authUser");
            }
        }
        setLoading(false);
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(newUser), SECRET_KEY).toString();
        localStorage.setItem("authUser", encrypted);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authUser");
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
