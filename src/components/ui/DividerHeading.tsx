import React from "react";

type DividerHeadingProps = {
  text: string;
  className?: string;
};

export const DividerHeading: React.FC<DividerHeadingProps> = ({ text, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 my-6 ${className}`}>
      <div className="flex-grow border-t border-gray-300" />
      <p className="text-[16px] font-bold text-primary whitespace-nowrap">
        {text.toUpperCase()}
      </p>
      <div className="flex-grow border-t border-gray-300" />
    </div>
  );
};
