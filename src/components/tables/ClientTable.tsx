import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileText, MoreHorizontal, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import RightMenu from "../ui/RightMenu";

interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    status: string;
    validationStatus: string;
    lastUpdated: string;
    relationshipManager: string;
    issues: number;
}

interface ClientTableProps {
    clients: Client[];
}

export const ClientTable = ({ clients }: ClientTableProps) => {
    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        const variants = {
            active: "default",
            inactive: "secondary",
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants]}>
                {status}
            </Badge>
        );
    };

    const getValidationBadge = (status: string) => {
        const config = {
            complete: { variant: "default" as const, icon: CheckCircle, label: "Complete" },
            pending: { variant: "secondary" as const, icon: AlertTriangle, label: "Pending" },
            issues: { variant: "destructive" as const, icon: AlertTriangle, label: "Issues" },
        };

        const { variant, icon: Icon, label } = config[status as keyof typeof config];

        return (
            <Badge variant={variant} className="flex items-center space-x-1">
                <Icon className="w-3 h-3" />
                <span>{label}</span>
            </Badge>
        );
    };

    if (!clients.length) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No peoples found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>DOB</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Validation</TableHead>
                        <TableHead>Relationship Manager</TableHead>
                        <TableHead>Issues</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => {
                        const menuItems = [
                            {
                                label: "View Profile",
                                onClick: () => navigate(`/people/${client.id}`),
                                icon: <Eye className="w-4 h-4" />,
                            },
                            {
                                label: "Archive Client",
                                onClick: () => console.log("Archive", client.id),
                                icon: <Trash2 className="w-4 h-4 text-red-500" />,
                                txtStyle: {
                                    color: 'red'
                                }
                            },
                        ];

                        return (
                            <RightMenu key={client.id} items={menuItems}>
                                {({ onContextMenu }) => (
                                    <TableRow
                                        onContextMenu={onContextMenu}
                                        className="hover:bg-muted/50 transition-fast"
                                    >
                                        <TableCell onClick={() => { navigate(`/people/${client.id}`) }} className="cursor-pointer">
                                            <div className="font-medium">{client.firstName} {client.lastName}</div>
                                            <div className="text-sm text-muted-foreground">ID: {client.id}</div>
                                        </TableCell>
                                        <TableCell onClick={() => { navigate(`/people/${client.id}`) }} className="cursor-pointer">{client.email}</TableCell>
                                        <TableCell>{client.dob}</TableCell>
                                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                                        <TableCell>{getValidationBadge(client.validationStatus)}</TableCell>
                                        <TableCell>{client.relationshipManager}</TableCell>
                                        <TableCell>
                                            {client.issues > 0 ? (
                                                <Badge variant="destructive">{client.issues}</Badge>
                                            ) : (
                                                <Badge variant="outline">0</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">{client.lastUpdated}</TableCell>
                                        <TableCell>
                                            {/* Dropdown for ⋮ button */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {menuItems.map((item, idx) => (
                                                        <DropdownMenuItem
                                                            key={idx}
                                                            className={item.txtStyle ? "text-red-500" : ""}
                                                            onClick={item.onClick}
                                                        >
                                                            {item.icon && <span className="mr-2">{item.icon}</span>}
                                                            {item.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
};
