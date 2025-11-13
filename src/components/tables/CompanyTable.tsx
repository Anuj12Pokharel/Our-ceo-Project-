import { useNavigate } from "react-router-dom";

// Define Company interface
export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    users: number;
    status: string;
    relationshipManager: string;
    expiryDate: string;
    daysLeft: number;
    disabled: boolean;
}

// Define CompanyTableProps interface
export interface CompanyTableProps {
    companies: Company[];
}
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Eye, Trash2, MoreHorizontal } from "lucide-react";
import RightMenu from "../ui/RightMenu";
import { Switch } from "../ui/switch";
import { useState } from "react";

export const CompanyTable = ({ companies }: CompanyTableProps) => {
    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState(companies);

    const getStatusBadge = (status: string) => {
        const variants = {
            active: "default",
            inactive: "secondary",
        } as const;
        return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
    };

    const toggleDisable = (id: number) => {
        setCompanyList(prev =>
            prev.map(company =>
                company.id === id
                    ? {
                        ...company,
                        disabled: !company.disabled,
                        status: company.disabled ? "active" : "inactive",
                    }
                    : company
            )
        );
    };

    if (!companies.length) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No companies found matching your criteria.</p>
            </div>
        );
    }

    return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Relationship Manager</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Days Left</TableHead>
                            <TableHead>Disable</TableHead>
                            <TableHead></TableHead> {/* Three dots menu column */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companyList.map((company) => {
                            const menuItems = [
                                {
                                    label: "View Details",
                                    onClick: () => navigate(`/companies/${company.id}`),
                                    icon: <Eye className="w-4 h-4" />,
                                },
                                {
                                    label: "Field Settings",
                                    onClick: () => navigate(`/admin/companies/${company.id}/fields`),
                                    icon: <MoreHorizontal className="w-4 h-4" />,
                                },
                                {
                                    label: "Archive Company",
                                    onClick: () => console.log("Archive", company.id),
                                    icon: <Trash2 className="w-4 h-4 text-red-500" />,
                                    txtStyle: { color: "red" },
                                },
                            ];
                            return (
                                <RightMenu key={company.id} items={menuItems}>
                                    {({ onContextMenu, onClick }) => (
                                        <TableRow
                                            onContextMenu={onContextMenu}
                                            onClick={onClick}
                                            className="hover:bg-muted/50 transition-fast"
                                        >
                                            <TableCell
                                                onClick={() => navigate(`/companies/${company.id}`)}
                                                className="cursor-pointer"
                                            >
                                                <div className="font-medium">{company.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{company.email}</div>
                                                <div className="text-sm text-muted-foreground">{company.phone}</div>
                                            </TableCell>
                                            <TableCell>{company.users}</TableCell>
                                            <TableCell>{getStatusBadge(company.status)}</TableCell>
                                            <TableCell>{company.relationshipManager}</TableCell>
                                            <TableCell>{company.expiryDate}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-white text-xs whitespace-nowrap ${company.daysLeft <= 5
                                                        ? "bg-red-500"
                                                        : company.daysLeft <= 15
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                        }`}
                                                >
                                                    {company.daysLeft} days
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={!company.disabled}
                                                    onCheckedChange={() => toggleDisable(company.id)}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <button
                                                    type="button"
                                                    className="p-2 rounded-full hover:bg-gray-100"
                                                    onClick={onClick}
                                                    aria-label="Open menu"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </RightMenu>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
}
// End of CompanyTable component
