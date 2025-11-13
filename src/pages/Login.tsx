import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePersonalization } from "@/hooks/use-personalization";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../public/logoWhite.png";
import { useAuth } from "@/context/AuthContext";

// Static users
const users = [
  { email: "admin@ceo.com", password: "admin123", role: "admin" },
  { email: "company@ceo.com", password: "company123", role: "company" },
  { email: "user@ceo.com", password: "user123", role: "user" },
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = usePersonalization();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const foundUser = users.find(
        u => u.email === formData.email && u.password === formData.password
      );

      setIsLoading(false);

      if (!foundUser) {
        toast({ title: "Login failed", description: "Invalid email or password", duration: 3000, variant: "destructive" });
        return;
      }

      // Login success
      login({ name: foundUser.email, role: foundUser.role });

      // Navigate based on role
      if (foundUser.role === "admin") navigate("/admin/dashboard");
      else if (foundUser.role === "company") navigate("/dashboard");
      else navigate("/user/dashboard");
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-8">
        <Card className="flex flex-col md:flex-row w-full max-w-sm md:max-w-4xl lg:max-w-5xl h-auto md:h-[600px] overflow-hidden rounded-3xl shadow-2xl bg-white animate-fade-in-up">
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center md:text-left">LOGIN</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-600">Username or Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label htmlFor="password" className="text-sm text-gray-600">Password</Label>
                  <Button variant="link" className="px-0 h-auto text-sm text-primary hover:underline">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 pr-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 text-gray-500 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                  className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">Remember me</Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-semibold text-lg bg-primary hover:bg-blue-700 text-white shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Button variant="link" className="px-0 h-auto text-sm text-primary hover:underline">
                Sign up
              </Button>
            </div>
          </div>

          <div className="w-full relative md:w-1/2 bg-primary flex items-center justify-center p-0 rounded-b-3xl md:rounded-l-none md:rounded-r-3xl">
            <img
              src="/login-img.png"
              alt="login"
              className="rounded-b-3xl md:rounded-l-none md:rounded-r-3xl"
            />
            <div className="absolute top-10 text-white text-4xl md:text-6xl">
              <img
                src={settings.customLogo || Logo}
                alt="logo"
                className="max-w-[300px] h-16 object-contain"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
