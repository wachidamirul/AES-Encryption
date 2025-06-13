import React, { useState } from "react";
import { Lock, Unlock, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

interface InfoPanelProps {
  title: string;
  icon?: "lock" | "unlock" | "shield";
  className?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  title,
  icon = "shield",
  className = "",
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getIcon = () => {
    switch (icon) {
      case "lock":
        return <Lock className="w-5 h-5" />;
      case "unlock":
        return <Unlock className="w-5 h-5" />;
      case "shield":
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${className}`}>
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition duration-150"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-2">
          <span className="text-blue-600">{getIcon()}</span>
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {isExpanded && <div className="p-4 border-t bg-gray-50">{children}</div>}
    </div>
  );
};

export default InfoPanel;
