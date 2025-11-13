import { FieldError, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";

type OpportunityType = {
    id: number;
    name: string;
    enabled: boolean;
};

const initialTypes: OpportunityType[] = [
    { id: 1, name: "Home Loans", enabled: true },
    { id: 2, name: "Commercial Loans ", enabled: false },
    { id: 3, name: "Plant & Equipment", enabled: true },
    { id: 4, name: "Personal Loans", enabled: false },
    { id: 5, name: "Property", enabled: false },
    { id: 8, name: "Insurance (Life)", enabled: true },
    { id: 9, name: "Accounting", enabled: true },
    { id: 10, name: "Team Deposit", enabled: false },
    { id: 11, name: "Premium Funding", enabled: false },
];

const OpportunityTypes = () => {
    const [types, setTypes] = useState<OpportunityType[]>(initialTypes);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const toggleEnabled = (id: number) => {
        setTypes(prev =>
            prev.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    const onSubmit = (data: any) => {
        const newType: OpportunityType = {
            id: types.length + 1,
            name: data.opportunityName,
            enabled: true,
        };
        setTypes(prev => [...prev, newType]);
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Opportunity Types</CardTitle>
                <CardDescription>
                    Enable or disable predefined opportunity types and add new ones.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Opportunity Type List */}
                    <div className="w-full">
                        <Table className="bg-white text-sm">
                            <TableHeader>
                                <TableRow className="bg-muted">
                                    <TableHead>Opportunity Type</TableHead>
                                    <TableHead className="text-right">Enable/Disable</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {types.map((type) => (
                                    <TableRow key={type.id} className="even:bg-muted/50">
                                        <TableCell className="py-1 px-2">{type.name}</TableCell>
                                        <TableCell className="text-right py-1 px-2">
                                            <Switch
                                                id={`toggle-${type.id}`}
                                                checked={type.enabled}
                                                onCheckedChange={() => toggleEnabled(type.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* RIGHT COLUMN: Add New Opportunity Form */}
                    <div className="w-full">
                        <h3 className="text-md font-semibold mb-2">Add New Opportunity</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FloatingInput
                                id="opportunityName"
                                label="Opportunity Name"
                                name="opportunityName"
                                register={register}
                                rules={{ required: "This field is required." }}
                                error={errors.opportunityName as FieldError}
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white text-sm px-4 py-2 rounded hover:bg-blue-500 transition"
                            >
                                Add Opportunity
                            </button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OpportunityTypes;
