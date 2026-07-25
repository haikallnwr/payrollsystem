import * as React from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  keywords?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  emptyText?: string;
}

export function SearchableSelect({ options, value, onValueChange, placeholder = "Select an option...", searchPlaceholder = "Type to search...", disabled = false, className, emptyText = "No items match your search." }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTimeout(() => setSearch(""), 0);
    }
  }, [isOpen]);

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchSub = opt.sublabel?.toLowerCase().includes(q) ?? false;
      const matchKeywords = opt.keywords?.toLowerCase().includes(q) ?? false;
      return matchLabel || matchSub || matchKeywords;
    });
  }, [options, search]);

  const handleSelect = (optionValue: string | number) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 px-3 py-2 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xs flex items-center justify-between text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-800 focus:emerald-800",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50",
          isOpen && "ring-2 ring-emerald-800 border-emerald-800",
        )}
      >
        <span className="truncate block pr-2">
          {selectedOption ? (
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {selectedOption.label}
              {selectedOption.sublabel && <span className="text-slate-400 font-normal ml-1.5 text-xs">{selectedOption.sublabel}</span>}
            </span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-4 h-4 text-slate-400 ml-2 mr-2 shrink-0" />
            <input ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden py-1" />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-3 text-center text-xs text-slate-400">{emptyText}</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn("w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between group", isSelected ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70")}
                  >
                    <div className="truncate pr-2">
                      <span className="block truncate font-medium">{opt.label}</span>
                      {opt.sublabel && <span className="block text-[11px] text-slate-400 dark:text-slate-500 font-normal">{opt.sublabel}</span>}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
