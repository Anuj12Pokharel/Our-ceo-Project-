import { useState, useRef } from "react";
import { X } from "lucide-react";

type RecipientsInputProps = {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
};

const RecipientsInput = ({ value, onChange, placeholder }: RecipientsInputProps) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addRecipient = () => {
        const newRecipient = inputValue.trim();
        if (newRecipient && !value.includes(newRecipient)) {
            onChange([...value, newRecipient]);
        }
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
            e.preventDefault();
            addRecipient();
        }
    };

    const removeRecipient = (recipient: string) => {
        onChange(value.filter((r) => r !== recipient));
    };

    return (
        <div
            className="flex flex-wrap items-center gap-2 border border-gray-300 rounded px-2 py-1 cursor-text focus-within:ring-2 focus-within:ring-blue-500 min-h-[40px]"
            onClick={() => inputRef.current?.focus()}
        >
            {value.map((recipient) => (
                <span
                    key={recipient}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                    {recipient}
                    <button
                        type="button"
                        onClick={() => removeRecipient(recipient)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <X size={14} />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[100px] border-none focus:outline-none text-sm"
            />
        </div>
    );
};

export default RecipientsInput;
