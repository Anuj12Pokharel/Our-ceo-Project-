import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Filter,
    Plus,
    Users,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";
import { CompanyTable } from "@/components/tables/CompanyTable";

const Companies = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Mock companies data
    const companies = [
        {
            id: 1,
            name: "Alpha Inc",
            email: "alpha@example.com",
            phone: "+1-234-567-890",
            users: 120,
            status: "active",
            relationshipManager: "Rijan Neupane",
            expiryDate: "2025-09-15",
            daysLeft: 27,
            disabled: false,
        },
        {
            id: 2,
            name: "Beta Ltd",
            email: "beta@example.com",
            phone: "+1-987-654-321",
            users: 75,
            status: "inactive",
            relationshipManager: "Sarah Walker",
            expiryDate: "2025-08-30",
            daysLeft: 11,
            disabled: true,
        },
        {
            id: 3,
            name: "Gamma Corp",
            email: "gamma@example.com",
            phone: "+44-20-1234-5678",
            users: 200,
            status: "active",
            relationshipManager: "Olivia Bennett",
            expiryDate: "2025-08-22",
            daysLeft: 3,
            disabled: false,
        },
        {
            id: 4,
            name: "Delta Solutions",
            email: "delta@example.com",
            phone: "+61-2-3456-7890",
            users: 50,
            status: "active",
            relationshipManager: "Liam Johnson",
            expiryDate: "2025-10-01",
            daysLeft: 43,
            disabled: false,
        },
        {
            id: 5,
            name: "Epsilon LLC",
            email: "epsilon@example.com",
            phone: "+1-555-123-4567",
            users: 150,
            status: "inactive",
            relationshipManager: "Emma Davis",
            expiryDate: "2025-09-05",
            daysLeft: 18,
            disabled: true,
        },
        {
            id: 6,
            name: "Zeta Technologies",
            email: "zeta@example.com",
            phone: "+49-30-123456",
            users: 90,
            status: "active",
            relationshipManager: "Noah Miller",
            expiryDate: "2025-09-20",
            daysLeft: 32,
            disabled: false,
        },
        {
            id: 7,
            name: "Eta Enterprises",
            email: "eta@example.com",
            phone: "+1-321-654-0987",
            users: 35,
            status: "active",
            relationshipManager: "Sophia Wilson",
            expiryDate: "2025-08-28",
            daysLeft: 9,
            disabled: false,
        },
        {
            id: 8,
            name: "Theta Co.",
            email: "theta@example.com",
            phone: "+44-20-8765-4321",
            users: 180,
            status: "inactive",
            relationshipManager: "James Brown",
            expiryDate: "2025-09-12",
            daysLeft: 25,
            disabled: true,
        },
        {
            id: 9,
            name: "Iota Industries",
            email: "iota@example.com",
            phone: "+61-3-9876-5432",
            users: 60,
            status: "active",
            relationshipManager: "Charlotte Taylor",
            expiryDate: "2025-08-26",
            daysLeft: 7,
            disabled: false,
        },
    ];

    const filteredCompanies = companies.filter((company) => {
        const matchesSearch =
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || company.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 space-y-6 animate-slide-in">
            {/* Header */}
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
                <p className="text-muted-foreground">
                    Manage and view all companies, their subscriptions, and expiry status
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-2xl font-bold">{companies.length}</p>
                                <p className="text-sm text-muted-foreground">Total Companies</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {companies.filter((c) => c.status === "active").length}
                                </p>
                                <p className="text-sm text-muted-foreground">Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-card">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {companies.filter((c) => c.daysLeft <= 15).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="shadow-card">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <CardTitle>Company Directory</CardTitle>
                            <CardDescription>Search and manage company profiles</CardDescription>
                        </div>
                        <Button className="shadow-elegant">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Company
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search companies by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            More Filters
                        </Button>
                    </div>

                    {/* Company Table */}
                    <CompanyTable companies={filteredCompanies} />

                    {filteredCompanies.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No companies found matching your criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Companies;
