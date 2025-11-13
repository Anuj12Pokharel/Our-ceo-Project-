import React, { useState, useEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";

type MenuItem = {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    txtStyle?: object;
};

type RightMenuProps = {
    items: MenuItem[];
    children: (props: { onContextMenu: (e: React.MouseEvent) => void; onClick: (e: React.MouseEvent) => void }) => React.ReactNode;
    txtStyle?: CSSProperties;
};

const RightMenu: React.FC<RightMenuProps> = ({ items, children, txtStyle }) => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleClick = () => setVisible(false);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        // Center the menu horizontally relative to the button
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const menuWidth = 192; // 48 * 4 = 192px (w-48)
        let x = rect.left + rect.width / 2 - menuWidth / 2;
        // Prevent overflow left/right
        if (x < 8) x = 8;
        if (x + menuWidth > window.innerWidth - 8) x = window.innerWidth - menuWidth - 8;
        const y = rect.bottom + window.scrollY + 4; // 4px gap below button
        setPos({ x, y });
        setVisible(true);
    };

    return (
        <>
            {children({ onContextMenu: handleContextMenu, onClick: handleContextMenu })}

            {visible &&
                createPortal(
                    <ul
                        className="absolute z-50 w-48 rounded-lg shadow-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 overflow-hidden"
                        style={{ top: pos.y, left: pos.x }}
                    >
                        {items.map((item, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    item.onClick();
                                    setVisible(false);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                style={item?.txtStyle || {}}
                            >
                                {item.icon && <span>{item.icon}</span>}
                                {item.label}
                            </li>
                        ))}
                    </ul>,
                    document.body
                )}
        </>
    );
};

export default RightMenu;
