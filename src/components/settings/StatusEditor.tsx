import { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { EmailActionEditor } from "./EmailActionEditor";
import { StatusType, WorkflowAction } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import HoverDropdown from "../ui/HoverDropdown";
import { TaskActionEditor } from "./TaskActionEditor";

// Opportunity Types
const opportunityTypes = ["Loan", "Insurance", "Investment"];

// Sortable Row Wrapper
function SortableRow({ id, children }: { id: number; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style} {...attributes}>
            <TableCell {...listeners} className="cursor-grab w-6 text-muted-foreground">
                <GripVertical size={16} />
            </TableCell>
            {children}
        </TableRow>
    );
}

export default function StatusEditor() {
    const [statuses, setStatuses] = useState<StatusType[]>([
        { id: 1, name: "Prospect", group: "1 Sales Process", workflows: [], autoActions: [], opportunityType: "Loan" },
        { id: 2, name: "Lead", group: "1 Sales Process", workflows: [], autoActions: [], opportunityType: "Loan" },
        { id: 3, name: "Appointed", group: "1 Sales Process", workflows: [], autoActions: [], opportunityType: "Insurance" },
        { id: 4, name: "Pre-Lodgement", group: "2 In Progress", workflows: [], autoActions: [], opportunityType: "Insurance" },
        { id: 5, name: "Lodged", group: "2 In Progress", workflows: [], autoActions: [], opportunityType: "Investment" },
    ]);

    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(null);
    const [selectedOpportunityType, setSelectedOpportunityType] = useState<string>(opportunityTypes[0]);

    // Drag sensors
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setStatuses((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddAction = (statusId: number, type: string) => {
        const updated = statuses.map((s) =>
            s.id === statusId
                ? {
                    ...s,
                    workflows: [
                        ...s.workflows,
                        {
                            id: Date.now(),
                            action: `${type}`,
                            type,
                            from: "User",
                            to: "Applicants",
                            active: false,
                        },
                    ],
                }
                : s
        );
        setStatuses(updated as any);
    };

    const handleToggleAction = (statusId: number, actionId: number, active: boolean) => {
        setStatuses(prev =>
            prev.map(status =>
                status.id === statusId
                    ? {
                        ...status,
                        workflows: status.workflows.map(w =>
                            w.id === actionId ? { ...w, active } : w
                        ),
                    }
                    : status
            )
        );
    };

    // Filter statuses by selected opportunity type
    const filteredStatuses = statuses.filter(s => s.opportunityType === selectedOpportunityType);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>
                    Status Editor for {selectedOpportunityType}
                </CardTitle>

                {/* Opportunity Type Selector */}
                <div className="relative inline-block">
                    <select
                        value={selectedOpportunityType}
                        onChange={(e) => setSelectedOpportunityType(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                        {opportunityTypes.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    {/* Down arrow icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredStatuses.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                        <Table className="bg-white text-sm">
                            <TableHeader>
                                <TableRow className="bg-muted">
                                    <TableHead></TableHead>
                                    <TableHead>S.N</TableHead>
                                    <TableHead>Status Name</TableHead>
                                    <TableHead>Status Group</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStatuses.map((status, idx) => (
                                    <>
                                        <SortableRow key={status.id} id={status.id}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell
                                                onClick={() => setExpandedRow(expandedRow === status.id ? null : status.id)}
                                                className="cursor-pointer font-medium"
                                            >
                                                {status.name}
                                            </TableCell>
                                            <TableCell>{status.group}</TableCell>
                                        </SortableRow>

                                        {expandedRow === status.id && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="bg-[#e8e8e8]">
                                                    <div className="flex gap-4">
                                                        {/* Left Tabs */}
                                                        <div className={`flex-1 ${selectedAction ? "w-1/2" : "w-full"}`}>
                                                            <div className="space-y-4 bg-white p-4 rounded-xl shadow">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h3 className="text-sm font-semibold text-gray-700">Workflow Actions</h3>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button size="sm">
                                                                                <Plus size={14} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-40">
                                                                            <DropdownMenuItem onClick={() => handleAddAction(status.id, "Email")}>
                                                                                Email
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleAddAction(status.id, "Message")}>
                                                                                Message
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleAddAction(status.id, "Task Template")}>
                                                                                Task Template
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>

                                                                {status.workflows.length === 0 ? (
                                                                    <p className="p-4 text-center text-sm text-muted-foreground">
                                                                        No workflow actions yet. Use the <b>Add</b> button to create one.
                                                                    </p>
                                                                ) : (
                                                                    <Table className="bg-white text-sm">
                                                                        <TableHeader>
                                                                            <TableRow className="bg-muted">
                                                                                <TableHead>Action</TableHead>
                                                                                <TableHead>From</TableHead>
                                                                                <TableHead>To</TableHead>
                                                                                <TableHead>Active</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {status.workflows.map((action) => (
                                                                                <TableRow
                                                                                    key={action.id}
                                                                                    onClick={() => setSelectedAction(action)}
                                                                                    className="cursor-pointer hover:bg-muted/40"
                                                                                >
                                                                                    <TableCell>{action.action}</TableCell>
                                                                                    <TableCell>{action.from}</TableCell>
                                                                                    <TableCell className="flex items-center gap-1">
                                                                                        {Array.isArray(action.to) ? (
                                                                                            <>
                                                                                                <span>{action.to[0]}</span>
                                                                                                {action.to.length > 1 && <HoverDropdown items={action.to.slice(1) as any} />}
                                                                                            </>
                                                                                        ) : (
                                                                                            action.to
                                                                                        )}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <Switch
                                                                                            checked={action.active}
                                                                                            onClick={(e) => e.stopPropagation()}
                                                                                            onCheckedChange={(checked) => handleToggleAction(status.id, action.id, checked)}
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Details Panel */}
                                                        {selectedAction && (
                                                            <div className="w-full border-l pl-4 animate-in fade-in slide-in-from-right space-y-4 bg-white p-4 rounded-xl shadow">
                                                                <h2 className="text-lg font-bold text-gray-800">{selectedAction.action}</h2>

                                                                {selectedAction.type.toLowerCase() === "email" ? (
                                                                    <div style={{ marginTop: '-30px' }}>
                                                                        <EmailActionEditor
                                                                            key={`email-${selectedAction.id}`}
                                                                            action={selectedAction}
                                                                            onSave={(updated) => {
                                                                                setStatuses((prev) =>
                                                                                    prev.map((status) => ({
                                                                                        ...status,
                                                                                        workflows: status.workflows.map((w) =>
                                                                                            w.id === selectedAction.id ? { ...w, ...updated } : w
                                                                                        ),
                                                                                    }))
                                                                                );
                                                                                setSelectedAction(null);
                                                                            }}
                                                                            onCancel={() => setSelectedAction(null)}
                                                                            templateType="email"
                                                                        />
                                                                    </div>
                                                                ) : selectedAction.type.toLowerCase() === "message" ? (
                                                                    <div style={{ marginTop: '-30px' }}>
                                                                        <EmailActionEditor
                                                                            key={`message-${selectedAction.id}`}
                                                                            action={selectedAction}
                                                                            onSave={(updated) => {
                                                                                setStatuses((prev) =>
                                                                                    prev.map((status) => ({
                                                                                        ...status,
                                                                                        workflows: status.workflows.map((w) =>
                                                                                            w.id === selectedAction.id ? { ...w, ...updated } : w
                                                                                        ),
                                                                                    }))
                                                                                );
                                                                                setSelectedAction(null);
                                                                            }}
                                                                            onCancel={() => setSelectedAction(null)}
                                                                            isMessageInput={true}
                                                                            templateType="message"
                                                                        />
                                                                    </div>
                                                                ) : selectedAction.type.toLowerCase() === "task template" ? (
                                                                    <TaskActionEditor
                                                                        action={selectedAction}
                                                                        onSave={(updated) => {
                                                                            setStatuses((prev) =>
                                                                                prev.map((status) => ({
                                                                                    ...status,
                                                                                    workflows: status.workflows.map((w) =>
                                                                                        w.id === selectedAction.id ? { ...w, ...updated } : w
                                                                                    ),
                                                                                }))
                                                                            );
                                                                            setSelectedAction(null);
                                                                        }}
                                                                        onCancel={() => setSelectedAction(null)}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </SortableContext>
                </DndContext>
            </CardContent>
        </Card>
    );
}
