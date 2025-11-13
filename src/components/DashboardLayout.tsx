import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClientTable } from "./tables/ClientTable";
import { NotificationCard } from "./NotificationCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const notifications = [
  { id: 1, title: "New client added", priority: "high" },
  { id: 2, title: "Report generated", priority: "medium" },
  { id: 3, title: "Task completed", priority: "low" },
  { id: 4, title: "Update received", priority: "medium" },
  { id: 5, title: "System alert", priority: "high" },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mock client data based on the specification
  const clients = [
    {
      id: 1,
      firstName: "Jessica",
      lastName: "Anderson",
      email: "jessica_mary_a@hotmail.com",
      phone: "0433 306 730",
      status: "active",
      validationStatus: "complete",
      lastUpdated: "2024-01-15",
      totalAssets: 950000,
      riskProfile: 88,
      issues: 0,
    },
    {
      id: 2,
      firstName: "Timothy",
      lastName: "Watene",
      email: "t.watene@email.com",
      phone: "0423 456 789",
      status: "active",
      validationStatus: "pending",
      lastUpdated: "2024-01-14",
      totalAssets: 750000,
      riskProfile: 82,
      issues: 2,
    },
    {
      id: 3,
      firstName: "Sarah",
      lastName: "Wilson",
      email: "s.wilson@email.com",
      phone: "0434 567 890",
      status: "active",
      validationStatus: "issues",
      lastUpdated: "2024-01-13",
      totalAssets: 1200000,
      riskProfile: 75,
      issues: 1,
    },
    {
      id: 4,
      firstName: "Michael",
      lastName: "Chen",
      email: "m.chen@email.com",
      phone: "0445 678 901",
      status: "inactive",
      validationStatus: "complete",
      lastUpdated: "2024-01-10",
      totalAssets: 680000,
      riskProfile: 90,
      issues: 0,
    },
  ];

  const filteredClients = clients.filter(client => {
    const term = searchValue.trim().toLowerCase();

    if (term === "") return true;

    return (
      client.firstName.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.replace(/\s+/g, "").includes(term)
    );
  });

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      setShowPanel(true);
    } else {
      setShowPanel(false);
    }
  }, [searchValue]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPanel]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col w-full overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="h-full px-4 flex items-center justify-between relative">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-accent transition-fast" />

                {user?.role !== "admin" && <div className="hidden md:flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search clients, reports..."
                      className="pl-10 w-80 h-9 bg-background/50"
                    />
                  </div>
                </div>}
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-2" align="end">
                    <div>
                      <div className="w-full flex items-center justify-between mb-3 mt-1">
                        <p className="text-[14px] text-[#000000] font-bold">
                          Notifications
                        </p>
                        <p className="text-[12px] text-primary cursor-pointer text-right">
                          View All Notifications
                        </p>
                      </div>
                      {notifications.map((n, index) => (
                        <NotificationCard
                          key={n.id}
                          title={n.title}
                          priority={n.priority}
                          length={notifications.length}
                          currentIndex={index}
                        />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                {user?.role !== "admin" && <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          j.doe@ourceo.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      navigate("/profile");
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>}
              </div>
            </div>

            {/* Floating Search Panel */}
            {showPanel && (
              <div
                ref={panelRef}
                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-3 w-[90%] max-w-4xl bg-background rounded-lg shadow-lg border border-gray-200 z-40"
              >
                <Tabs defaultValue="clients" className="w-full">
                  <TabsList className="border-b w-full rounded-b-none justify-start">
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                  <div className="p-4 space-y-2 max-h-100 overflow-auto">
                    <TabsContent value="clients">
                      <ClientTable clients={filteredClients} />
                    </TabsContent>
                    <TabsContent value="opportunities">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="reports">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No reports found matching your criteria.</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
