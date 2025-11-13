import React from "react";
import { Sun, Moon } from "lucide-react";

interface DarkLightToggleProps {
    isDarkMode: boolean;
    onToggle: () => void;
}

const DarkLightToggle: React.FC<DarkLightToggleProps> = ({ isDarkMode, onToggle }) => {
    return (
        <button
            aria-label="Toggle dark mode"
            role="switch"
            aria-checked={isDarkMode}
            onClick={onToggle}
            className={`
        relative inline-flex items-center h-7 w-14 rounded-full cursor-pointer
        transition-colors duration-300
        ${isDarkMode ? "bg-gray-700" : "bg-yellow-400"}
        focus:outline-none
      `}
        >
            {/* Sun Icon on left */}
            <Sun
                className={`absolute left-1.5 top-1/2 transform -translate-y-1/2 transition-opacity duration-300`}
                size={16}
                color={isDarkMode ? "#ffffff" : "#000000"}
            />

            {/* Moon Icon on right */}
            <Moon
                className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 transition-opacity duration-300`}
                size={16}
                color={isDarkMode ? "#ffffff" : "#000000"}
            />

            {/* The circle knob */}
            <span
                className={`
          inline-block w-6 h-6 bg-white rounded-full shadow-md transform
          transition-transform duration-300
          ${isDarkMode ? "translate-x-7" : "translate-x-1"}
        `}
            />
        </button>
    );
};

export default DarkLightToggle;
