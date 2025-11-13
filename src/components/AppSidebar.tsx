import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Upload,
  ShieldCheck,
  Settings,
  User,
  Factory,
  LogOut,
  HandHeart,
  Mail,
  SettingsIcon,
  User2Icon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePersonalization } from "@/hooks/use-personalization";
import "../styles/css/adminSidebar.css";
import Logo from "../../public/logoWhite.png";
import { useAuth } from "@/context/AuthContext";

// ---- Types ----
type NavItem = {
  title: string;
  url?: string;
  icon: React.ElementType;
  counter?: number | null;
  children?: NavItem[];
};

// ---- Navigation Config ----

// Admin navigation
const adminNavigationItems: NavItem[] = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Companies", url: "/admin/companies", icon: Factory },
];

// Company navigation
const companyNavigationItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "People", url: "/people", icon: Users },
  { title: "Opportunities", url: "/opportunities", icon: HandHeart },
  { title: "Emails", url: "/emails", icon: Mail, counter: 3 },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
  { title: "Validation", url: "/dashboard/validation", icon: ShieldCheck },
  { title: "Doc Centre", url: "/dashboard/upload", icon: Upload },
  { title: "User Management", url: "/user-management", icon: User2Icon },
  {
    title: "Settings",
    icon: SettingsIcon,
    children: [
      { title: "General", url: "/settings/general", icon: Settings },
      { title: "Templates", url: "/settings/templates", icon: FileText },
    ],
  },
];

// User navigation
const userNavigationItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Emails", url: "/emails", icon: Mail, counter: 3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { toast } = useToast();
  const { settings } = usePersonalization();
  const { logout, user } = useAuth();

  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // Choose navigation items based on role
  const navigationItems =
    user?.role === "admin"
      ? adminNavigationItems
      : user?.role === "company"
        ? companyNavigationItems
        : userNavigationItems;

  // ---- Expand/Collapse State ----
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // ---- Helpers ----
  const isActive = (path: string) => currentPath === path;

  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-primary hover:!bg-primary text-white font-medium transition-colors duration-200"
      : "hover:!bg-primary text-sidebar-foreground transition-colors duration-200";

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account",
    });
    logout();
  };

  // ---- Recursive Renderer ----
  const renderNavItems = (items: NavItem[], depth = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedMenus.includes(item.title);

      return (
        <SidebarMenuItem key={item.title}>
          {hasChildren ? (
            <>
              {/* Parent with children */}
              <SidebarMenuButton
                onClick={() => toggleMenu(item.title)}
                className={`h-10 ${depth > 0 ? "ml-6" : ""} hover:bg-primary`}
                title={collapsed ? item.title : undefined}
              >
                <div className="flex items-center w-full">
                  <item.icon className="w-5 h-5 shrink-0 text-sidebar-foreground" />
                  {!collapsed && (
                    <span className="ml-2 font-medium text-sidebar-foreground">
                      {item.title}
                    </span>
                  )}
                  {!collapsed && (
                    <ChevronRight
                      className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                        }`}
                    />
                  )}
                </div>
              </SidebarMenuButton>

              {/* Children */}
              <div
                className={`mt-1 overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96" : "max-h-0"
                  }`}
              >
                <SidebarMenu>{renderNavItems(item.children!, depth + 1)}</SidebarMenu>
              </div>
            </>
          ) : (
            /* Leaf link */
            <SidebarMenuButton asChild className={`h-10 ${depth > 0 ? "ml-6" : ""}`}>
              <NavLink
                to={item.url!}
                end
                className={getNavClass(item.url!)}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0 text-sidebar-foreground" />
                {!collapsed && (
                  <div className="flex flex-col">
                    <span className="font-medium text-sidebar-foreground">{item.title}</span>
                  </div>
                )}
                {!collapsed && item.counter != null && (
                  <span className="ml-auto bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.counter}
                  </span>
                )}
              </NavLink>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });
  };

  // ---- Render ----
  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-smooth border-r border-sidebar-border`}
      style={{
        backgroundColor: `hsl(var(--sidebar-background))`,
        color: `hsl(var(--sidebar-foreground))`,
      }}
    >
      <SidebarContent
        className="sidebar-wrapper"
        style={{
          backgroundColor: `hsl(var(--sidebar-background))`,
          color: `hsl(var(--sidebar-foreground))`,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <img
              src={settings.customLogo || Logo}
              alt="logo"
              className="max-w-[150px] h-10 object-contain"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(navigationItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="p-2 border-t border-sidebar-border mt-auto">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start h-10 text-sidebar-foreground hover:bg-primary hover:text-white"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
