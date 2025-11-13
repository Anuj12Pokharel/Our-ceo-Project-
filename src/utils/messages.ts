import { Message } from "@/types/types";

const STORAGE_KEY = "messages";

export const getMessages = (): Message[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveMessages = (messages: Message[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

export const addMessage = (msg: Message) => {
    const messages = getMessages();
    messages.unshift(msg); // add to top
    saveMessages(messages);
};

export const updateMessage = (id: string, update: Partial<Message>) => {
    const messages = getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
        messages[index] = { ...messages[index], ...update };
        saveMessages(messages);
    }
};

export const deleteMessage = (id: string) => {
    const messages = getMessages();
    saveMessages(messages.filter((m) => m.id !== id));
};
