import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  FileText,
  Edit,
  AlertTriangle,
  CheckCircle,
  Building,
  Heart,
  Users,
  Briefcase,
  HandHeart,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import PersonalInformation from "@/components/clientProfile/PersonalInformation";
import CustomTabs from "@/components/CustomTabs";
import Addresses from "@/components/clientProfile/Addresses";
import Identification from "@/components/clientProfile/Identification";
import Notes from "@/components/clientProfile/Notes";
import Attachments from "@/components/clientProfile/Attachments";
import ChangeLog from "@/components/clientProfile/ChangeLog";

const ClientProfile = () => {
  const { clientId } = useParams();

  // Dummy client data
  const client = {
    id: 1,
    firstName: "Jessica",
    lastName: "Anderson",
    middleName: "Mary",
    email: "jessica_mary_a@hotmail.com",
    phone: "0433 306 730",
    dateOfBirth: "1990-05-29",
    gender: "Female",
    maritalStatus: "Single",
    address: {
      street: "11 Tutty Place",
      suburb: "Greensborough",
      state: "VIC",
      postcode: "3088",
    },
    nextOfKin: {
      name: "Angela Anderson",
      relationship: "Mother",
      phone: "0433 306 730",
    },
    taxFileNumber: "123456789",
    validationStatus: "complete",
    lastUpdated: "2024-01-15",
  };

  const employment = {
    occupation: "Sales Rep",
    occupationDescription: "Sales",
    employer: "Cluey Learning",
    employmentStatus: "Casual",
    grossAnnualIncome: 100000,
    superGuaranteeIncome: 100000,
    superGuaranteeRate: 11.5,
    salaryScacriceAmount: 0,
    concessionalContributions: 10000,
    nonConcessionalContributions: 0,
    hazardousMaterials: false,
    officeBasedPercentage: 100,
  };

  const assets = [
    {
      id: 1,
      type: "Investment Property",
      name: "Investment Property - Melbourne",
      value: 950000,
      offsetBalance: 0,
      interestRate: 4.5,
      interestType: "Variable",
      repaymentType: "Principal and Interest",
      minimumRepayment: 3500,
      ownershipPercentage: 100,
    },
  ];

  const debts = [
    {
      id: 1,
      type: "Investment Property Loan",
      value: 695000,
      interestRate: 4.5,
      monthlyRepayment: 3500,
    },
  ];

  const riskProfile = {
    totalScore: 88,
    questions: [
      { question: 1, score: 20, maxScore: 25 },
      { question: 2, score: 14, maxScore: 20 },
      { question: 3, score: 18, maxScore: 20 },
      { question: 4, score: 16, maxScore: 20 },
      { question: 5, score: 20, maxScore: 25 },
    ],
    riskCategory: "Balanced Growth",
    recommendedAllocation: {
      growth: 70,
      defensive: 30,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const getValidationBadge = (status: string) => {
    const config = {
      complete: { variant: "default" as const, icon: CheckCircle, label: "Complete" },
      pending: { variant: "secondary" as const, icon: AlertTriangle, label: "Pending" },
      issues: { variant: "destructive" as const, icon: AlertTriangle, label: "Issues" },
    };

    const { variant, icon: Icon, label } = config[status as keyof typeof config];

    return (
      <Badge variant={variant} className="flex items-center space-x-1" style={{ width: "fit-content" }}>
        <Icon className="w-3 h-3" />
        <span>{label}</span>
      </Badge>
    );
  };

  // Tab definitions
  const tabs = [
    {
      value: "details",
      label: "Details",
      icon: <User className="w-4 h-4" />,
      content: <PersonalInformation />,
    },
    {
      value: "addresses",
      label: "Addresses",
      icon: <MapPin className="w-4 h-4" />,
      content: <Addresses />,
    },
    {
      value: "identification",
      label: "Identification",
      icon: <Shield className="w-4 h-4" />,
      content: <Identification />,
    },
    {
      value: "employment",
      label: "Employment",
      icon: <Briefcase className="w-4 h-4" />,
      content: (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Employment Details</span>
            </CardTitle>
            <CardDescription>Current employment and income information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                <p className="text-lg font-medium">{employment.occupation}</p>
                <p className="text-sm text-muted-foreground">{employment.occupationDescription}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employer</label>
                <p>{employment.employer}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                <Badge variant="outline">{employment.employmentStatus}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gross Annual Income</label>
                <p className="text-xl font-bold text-success">{formatCurrency(employment.grossAnnualIncome)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Super Guarantee Income</label>
                <p>{formatCurrency(employment.superGuaranteeIncome)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Super Guarantee Rate</label>
                <p>{formatPercentage(employment.superGuaranteeRate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Concessional Contributions</label>
                <p>{formatCurrency(employment.concessionalContributions)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Office Based</label>
                <p>{formatPercentage(employment.officeBasedPercentage)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Hazardous Materials</label>
                <Badge variant={employment.hazardousMaterials ? "destructive" : "default"}>
                  {employment.hazardousMaterials ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      value: "opportunities",
      label: "Opportunities",
      icon: <HandHeart className="w-4 h-4" />,
      content: (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>Opportunities for client</CardDescription>
          </CardHeader>
          <CardContent><h1>No data available</h1></CardContent>
        </Card>
      ),
    },
    {
      value: "relationships",
      label: "Relationships",
      icon: <Users className="w-4 h-4" />,
      content: (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Relationships</CardTitle>
            <CardDescription>Relationship details of a client</CardDescription>
          </CardHeader>
          <CardContent><h1>No data available</h1></CardContent>
        </Card>
      ),
    },
    {
      value: "notes",
      label: "Notes",
      icon: <FileText className="w-4 h-4" />,
      content: <Notes />,
    },
    {
      value: "tasks",
      label: "Tasks",
      icon: <Calendar className="w-4 h-4" />,
      content: (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Client related tasks</CardDescription>
          </CardHeader>
          <CardContent><h1>No data available</h1></CardContent>
        </Card>
      ),
    },
    {
      value: "attachments",
      label: "Attachments",
      icon: <FileText className="w-4 h-4" />,
      content: <Attachments />,
    },
    {
      value: "changelog",
      label: "Change Log",
      icon: <AlertTriangle className="w-4 h-4" />,
      content: <ChangeLog />,
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/people">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {client.firstName} {client.lastName}
            </h1>
            {getValidationBadge(client.validationStatus)}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(assets.reduce((sum, asset) => sum + asset.value, 0))}</p>
                <p className="text-sm text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(employment.grossAnnualIncome)}</p>
                <p className="text-sm text-muted-foreground">Annual Income</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{riskProfile.totalScore}/100</p>
                <p className="text-sm text-muted-foreground">Risk Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(debts.reduce((sum, debt) => sum + debt.value, 0))}</p>
                <p className="text-sm text-muted-foreground">Total Debts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <CustomTabs tabs={tabs} />
    </div>
  );
};

export default ClientProfile;
