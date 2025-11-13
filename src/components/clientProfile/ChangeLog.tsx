import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Switch } from "../ui/switch";
import DarkLightToggle from "../ui/DarkLightToggle";
import { FileTypeIcon, Icon, ListIcon } from "lucide-react";

interface LogEntry {
    id: number;
    date: Date;
    user: string;
    action: string;
    details: string;
}

const demoLogs: LogEntry[] = [
    { id: 1, date: new Date(), user: "Rijan neupane", action: "Details", details: "Personal Details changed by Rijan Neupane." },
    { id: 2, date: new Date(), user: "Jane Smith", action: "Address", details: "Jane Smith added new address." },
    { id: 3, date: new Date(), user: "Mark Lee", action: "Identification", details: "Mark Lee uploaded identification documents." },
    { id: 4, date: new Date(), user: "Bijay Manandhar", action: "Opportunities", details: "New opportunities assigned." },
];

export default function ChangeLogCard() {
    const [viewMode, setViewMode] = useState<"ui" | "raw">("ui");
    const [darkMode, setDarkMode] = useState(false);

    return (
        <Card className="shadow-card">
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Change Log</CardTitle>
                    <CardDescription>Activity history</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                    {viewMode === "raw" && (
                        <>
                            <DarkLightToggle
                                isDarkMode={darkMode}
                                onToggle={() => setDarkMode(!darkMode)}
                            />
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === "ui" ? "raw" : "ui")}
                    >
                        {viewMode == "ui" ? <FileTypeIcon /> : <ListIcon />}
                        {viewMode === "ui" ? "Raw View" : "UI View"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-2">
                {viewMode === "ui" ? (
                    // striped UI view
                    <ul className="max-h-[400px] overflow-y-auto text-sm divide-y divide-gray-200">
                        {demoLogs.map((log, index) => (
                            <li
                                key={log.id}
                                className={`flex gap-2 px-2 py-1.5 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }`}
                            >
                                <span className="text-gray-500 shrink-0 w-[140px] text-xs">
                                    {format(log.date, "yyyy-MM-dd HH:mm")}
                                </span>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-medium">{log.action}</span>
                                    <span className="text-gray-600 text-xs">
                                        {log.user} — {log.details}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <pre
                        className={`p-2 rounded-md text-xs overflow-x-auto max-h-[400px] overflow-y-auto font-mono border ${darkMode
                            ? "bg-black text-green-600 border-gray-700"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                    >
                        {demoLogs
                            .map(
                                log =>
                                    `[${format(log.date, "yyyy-MM-dd HH:mm:ss")}] ${log.user} - [${log.action}] - ${log.details}`
                            )
                            .join("\n")}
                    </pre>
                )}
            </CardContent>
        </Card>
    );
}
