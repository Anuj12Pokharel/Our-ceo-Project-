import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type HoverDropdownProps = {
    items: string[];
    children?: React.ReactNode;
};

const HoverDropdown: React.FC<HoverDropdownProps> = ({ items, children }) => {
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (hovered) {
            setMounted(true);
            // Calculate position
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
            }
            // Trigger fade-in on next tick
            const t = setTimeout(() => setVisible(true), 0);
            return () => clearTimeout(t);
        } else {
            // Trigger fade-out
            setVisible(false);
            // After transition, unmount
            const timeout = setTimeout(() => setMounted(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [hovered]);

    return (
        <div
            ref={triggerRef}
            className="inline-block"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children || (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer whitespace-nowrap">
                    +{items.length} more
                </span>
            )}

            {mounted &&
                createPortal(
                    <div
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute z-[9999] bg-white border border-gray-300 rounded shadow-lg
                            transition-all duration-200 ease-in-out
                            ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                    >
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-1 text-sm text-gray-700 hover:bg-blue-50 whitespace-nowrap"
                            >
                                {item}
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default HoverDropdown;
