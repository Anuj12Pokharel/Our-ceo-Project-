import { useState } from "react";
import { Link } from "react-router-dom";
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
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react";
import { ClientTable } from "@/components/tables/ClientTable";

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock client data based on the specification
  const clients = [
    {
      id: 1,
      firstName: "Jessica",
      lastName: "Anderson",
      email: "jessica_mary_a@hotmail.com",
      phone: "0433 306 730",
      dob: "21 Aug 2002",
      status: "active",
      validationStatus: "complete",
      lastUpdated: "2024-01-15",
      relationshipManager: "Rijan Neupane",
      issues: 0,
    },
    {
      id: 2,
      firstName: "Daniel",
      lastName: "Nguyen",
      email: "daniel.nguyen@gmail.com",
      phone: "0412 567 890",
      dob: "12 Jan 1990",
      status: "inactive",
      validationStatus: "pending",
      lastUpdated: "2024-07-22",
      relationshipManager: "Sarah Walker",
      issues: 2,
    },
    {
      id: 3,
      firstName: "Emily",
      lastName: "Jones",
      email: "emily.jones@outlook.com",
      phone: "0401 222 333",
      dob: "05 Mar 1985",
      status: "active",
      validationStatus: "issues",
      lastUpdated: "2024-05-10",
      relationshipManager: "Rijan Neupane",
      issues: 1,
    },
    {
      id: 4,
      firstName: "Liam",
      lastName: "Smith",
      email: "liam.smith@yahoo.com",
      phone: "0432 456 789",
      dob: "18 Jul 1993",
      status: "active",
      validationStatus: "pending",
      lastUpdated: "2024-03-14",
      relationshipManager: "Olivia Bennett",
      issues: 0,
    },
    {
      id: 5,
      firstName: "Chloe",
      lastName: "Brown",
      email: "chloe.brown@gmail.com",
      phone: "0421 789 654",
      dob: "30 Sep 1998",
      status: "inactive",
      validationStatus: "complete",
      lastUpdated: "2023-12-09",
      relationshipManager: "Liam Patel",
      issues: 3,
    },
    {
      id: 6,
      firstName: "Ethan",
      lastName: "Wilson",
      email: "ethan.wilson@hotmail.com",
      phone: "0403 654 321",
      dob: "10 May 1995",
      status: "active",
      validationStatus: "complete",
      lastUpdated: "2024-06-01",
      relationshipManager: "Sarah Walker",
      issues: 0,
    },
    {
      id: 7,
      firstName: "Isabella",
      lastName: "Taylor",
      email: "isabella.taylor@mail.com",
      phone: "0410 987 123",
      dob: "22 Nov 2000",
      status: "active",
      validationStatus: "pending",
      lastUpdated: "2024-07-03",
      relationshipManager: "Olivia Bennett",
      issues: 1,
    },
    {
      id: 8,
      firstName: "Noah",
      lastName: "Lee",
      email: "noah.lee@domain.com",
      phone: "0455 321 456",
      dob: "08 Feb 1988",
      status: "inactive",
      validationStatus: "issues",
      lastUpdated: "2024-01-29",
      relationshipManager: "Liam Patel",
      issues: 2,
    },
    {
      id: 9,
      firstName: "Ava",
      lastName: "Martin",
      email: "ava.martin@example.com",
      phone: "0423 876 543",
      dob: "14 Apr 1992",
      status: "active",
      validationStatus: "complete",
      lastUpdated: "2024-02-18",
      relationshipManager: "Rijan Neupane",
      issues: 0,
    },
    {
      id: 10,
      firstName: "Mason",
      lastName: "White",
      email: "mason.white@example.com",
      phone: "0467 890 234",
      dob: "03 Dec 1983",
      status: "inactive",
      validationStatus: "pending",
      lastUpdated: "2024-08-01",
      relationshipManager: "Sarah Walker",
      issues: 4,
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">People Management</h1>
        <p className="text-muted-foreground">
          Manage and view all people profiles and their validation status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Total People</p>
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
                  {clients.filter(c => c.validationStatus === 'complete').length}
                </p>
                <p className="text-sm text-muted-foreground">Validated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {clients.filter(c => c.validationStatus === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
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
                  {clients.filter(c => c.validationStatus === 'issues').length}
                </p>
                <p className="text-sm text-muted-foreground">With Issues</p>
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
              <CardTitle>People Directory</CardTitle>
              <CardDescription>Search and manage people profiles</CardDescription>
            </div>
            <Button className="shadow-elegant">
              <Plus className="w-4 h-4 mr-2" />
              Add New People
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search peoples by name or email..."
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

          {/* Client Table */}
          <ClientTable clients={filteredClients} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;