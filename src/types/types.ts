export type Message = {
    id: string;
    recipients: string[];
    subject: string;
    body: string;
    attachments: File[];
    status: "inbox" | "sent" | "draft" | "trash";
    date: string;
    deletedFrom?: "inbox" | "sent" | "draft";
};

export type WorkflowAction = {
    id: number;
    action: string;
    type: string;
    from: string;
    to: string;
    active: boolean;
    subject: string;
    body: string;
};

export type StatusType = {
    id: number;
    name: string;
    group: string;
    workflows: WorkflowAction[];
    autoActions: WorkflowAction[];
    opportunityType?: string;
};

export interface TaskRow {
    id: string;
    subject: string;
    delegate: string;
    owner: string;
    offset: string;
    offsetDependency: string;
    type: string;
    priority: string;
}

export interface TaskTemplate {
    id: string;
    title: string;
    opportunityType: string;
    comments: string;
    tasks: TaskRow[];
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
}

export interface TaskTemplateData {
    title: string;
    opportunityType: string;
    comments: string;
}