import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { HelpCircle, ChevronRight, X } from 'lucide-react';

// --- Card Components ---
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 pb-2 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h3 className={`font-bold text-lg ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 pt-2 ${className}`}>{children}</div>
);

// --- Button Component ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg";
}

export const Button = ({ children, onClick, variant = "primary", size = "default", className = "", disabled, ...props }: ButtonProps) => {
  const baseStyle = "font-medium transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#008753] text-white hover:bg-[#007043]",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "text-gray-600 hover:bg-gray-100",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  const sizes = {
    default: "px-4 py-2 rounded-lg",
    sm: "px-3 py-1.5 text-xs rounded-md",
    lg: "px-6 py-3 text-lg rounded-xl"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Badge Component ---
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
}

export const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const baseStyle = "text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center";
  const variants = {
    default: "bg-green-100 text-green-800",
    outline: "border bg-transparent border-gray-200",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800"
  };
  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Input Component ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = "", ...props }: InputProps) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008753] disabled:opacity-50 ${className}`} 
    {...props} 
  />
);

// --- Label Component ---
interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label = ({ children, htmlFor, className = "" }: LabelProps) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none mb-1.5 block ${className}`}>
    {children}
  </label>
);

// --- Progress Component ---
interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress = ({ value, className = "" }: ProgressProps) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
    <div 
      className="h-full w-full flex-1 bg-[#008753] transition-all" 
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} 
    />
  </div>
);

// --- Select Component ---
interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = ({ value, onValueChange, options, placeholder, className = "" }: SelectProps) => (
  <div className={`relative ${className}`}>
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#008753] appearance-none"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronRight className="absolute right-3 top-3 h-4 w-4 rotate-90 text-gray-500 pointer-events-none" />
  </div>
);

// --- Tabs Component ---
// (We moved Tabs logic to local state in some components, but keeping primitives here is good practice)
import { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (v: string) => void;
}

const TabsContext = createContext<TabsContextType>({ activeTab: '', setActiveTab: () => {} });

export const Tabs = ({ value, onValueChange, children, defaultValue, className = "" }: { value?: string, onValueChange?: (val: string) => void, children: ReactNode, defaultValue?: string, className?: string }) => {
  const [localTab, setLocalTab] = useState(defaultValue || '');
  const activeTab = value !== undefined ? value : localTab;

  const handleTabChange = (val: string) => {
    setLocalTab(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full ${className}`}>{children}</div>
);

export const TabsTrigger = ({ value, children, className = "" }: { value: string, children: ReactNode, className?: string }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 w-full ${activeTab === value ? 'bg-white text-gray-950 shadow-sm' : 'hover:bg-gray-200/50 hover:text-gray-900'} ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }: { value: string, children: ReactNode, className?: string }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={`mt-2 ring-offset-white focus-visible:outline-none ${className}`}>{children}</div>;
};

// --- Dialog Component ---
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none z-10 bg-white/50 p-1"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">{children}</div>
);
export const DialogTitle = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);
export const DialogDescription = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-gray-500 mt-1">{children}</p>
);
export const DialogFooter = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 gap-2">{children}</div>
);

// --- InfoTooltip Component ---
interface InfoTooltipProps {
  content: string;
  isDark?: boolean;
}

export const InfoTooltip = ({ content, isDark = false }: InfoTooltipProps) => (
  <div className="group relative inline-block ml-1">
    <button className="inline-flex items-center justify-center cursor-help">
      <HelpCircle size={14} className={`${isDark ? 'text-white/60 hover:text-white/80' : 'text-gray-400 hover:text-gray-600'} transition-colors`} />
    </button>
    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 pointer-events-none">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
    </div>
  </div>
);