// FloatingInput.tsx
import { ChevronDown, CircleCheck, CircleCheckBig, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
    FieldError,
    RegisterOptions,
    UseFormRegister,
    UseFormWatch,
    UseFormSetValue,
} from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getTimeUntilDate, getYearsFromDate } from "@/lib/utils";
import { createPortal } from "react-dom";

type FlatOption = { label: string; value: string };
type OptionGroup = { group: string; items: (string | FlatOption)[] };

type FloatingInputProps = {
    label: string;
    id: string;
    name: string;
    selectTxt?: string;
    type?: string;
    register?: UseFormRegister<any>;
    rules?: RegisterOptions;
    error?: FieldError | { message: string };
    options?: (string | FlatOption | OptionGroup)[];
    rows?: number;
    setValue?: UseFormSetValue<any>;
    watch?: UseFormWatch<any>;
    selected?: string | boolean;
    cursor?: string;
    minDate?: Date;
    maxDate?: Date;
    dateMode?: "dob" | "expiry" | "default";
    onChange?: (
        e:
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
            | { target: { name: string; value: any } }
    ) => void;
    value?: string | boolean | string[];
    groupOptions?: { label: string; value: string }[];

    /** NEW: multi-select support */
    allowMultiple?: boolean;
    showAsBars?: boolean;
};

export const FloatingInput = ({
    label,
    selectTxt = "",
    id,
    name,
    type = "text",
    register,
    rules,
    error,
    options = [],
    rows = 6,
    setValue,
    watch,
    selected,
    cursor,
    minDate,
    maxDate,
    dateMode,
    onChange,
    value,
    groupOptions = [],
    allowMultiple = false,
    showAsBars = false,
}: FloatingInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarPos, setCalendarPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const isTextArea = type === "textarea";
    const isSelect = type === "select";
    const isDate = type === "date";
    const isRadio = type === "radio";
    const isCheckbox = type === "checkbox";
    const isEmail = type === "email";
    const isDob = dateMode === "dob";
    const isExpiry = dateMode === "expiry";
    const isCheckboxGroup = type === "checkbox-group";
    const isRadioGroup = type === "radio-group";

    const handleCheckboxGroupChange = (val: string) => {
        if (!Array.isArray(value)) return;
        if (value.includes(val)) {
            onChange?.({
                target: {
                    name,
                    value: value.filter((v) => v !== val),
                },
            } as any);
        } else {
            onChange?.({
                target: {
                    name,
                    value: [...value, val],
                },
            } as any);
        }
    };

    const defaultDob = new Date(new Date().setFullYear(new Date().getFullYear() - 20));

    const commonClass = clsx(
        "peer w-full h-10 px-2 text-[14px] bg-white border border-gray-300 rounded-[5px]",
        "focus:border-blue-600 focus:ring-1 focus:ring-blue-500",
        "placeholder-transparent transition-all",
        error && "border-red-500",
        cursor && `cursor-${cursor}`
    );

    const labelClass = clsx(
        "absolute left-2",
        "top-0 -translate-y-1/2",
        "text-[11px] text-gray-500 transition-all duration-200",
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent",
        "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-blue-600 peer-focus:bg-white",
        "peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:bg-white bg-white"
    );

    // Close on outside click for calendar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };
        if (showCalendar) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendar]);

    const handleCalendarOpen = (e: React.MouseEvent<HTMLInputElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        const calendarHeightApprox = 300;
        const spaceBelow = window.innerHeight - rect.bottom;

        let top: number;
        if (spaceBelow < calendarHeightApprox) {
            top = rect.top + scrollTop - calendarHeightApprox;
        } else {
            top = rect.bottom + scrollTop + 10;
        }

        const left = rect.left + scrollLeft;

        setCalendarPos({ top, left });
        setShowCalendar(true);
    };

    /** ---------- Multi-select dropdown state (only used when allowMultiple OR showAsBars) ---------- */
    const [msOpen, setMsOpen] = useState(false);
    const [msSearch, setMsSearch] = useState("");
    const msRef = useRef<HTMLDivElement>(null);

    // Close multi-select on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (msRef.current && !msRef.current.contains(e.target as Node)) {
                setMsOpen(false);
            }
        };
        if (msOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [msOpen]);

    const filteredOptions = (options || []).filter((opt) => {
        if (typeof opt === "string") {
            return opt.toLowerCase().includes(msSearch.toLowerCase());
        }
        if (typeof opt === "object" && "group" in opt) {
            // Check if group name or any item matches
            return (
                opt.group.toLowerCase().includes(msSearch.toLowerCase()) ||
                opt.items.some((i) => i.toLowerCase().includes(msSearch.toLowerCase()))
            );
        }
        return false;
    });

    const isValueArray = Array.isArray(value);

    const handleMsSelect = (opt: string) => {
        if (allowMultiple) {
            const current = isValueArray ? [...value] : [];
            if (current.includes(opt)) {
                const newVal = current.filter((v: string) => v !== opt);
                onChange?.({ target: { name, value: newVal } } as any);
            } else {
                const newVal = [...current, opt];
                onChange?.({ target: { name, value: newVal } } as any);
            }
        } else {
            onChange?.({ target: { name, value: opt } } as any);
            setMsOpen(false);
        }
    };

    const removeMsValue = (opt: string) => {
        if (!isValueArray) return;
        const newVal = value.filter((v: string) => v !== opt);
        onChange?.({ target: { name, value: newVal } } as any);
    };

    /** ------------------------------------------------------------------------------------------------ */

    return (
        <div className="relative w-full">
            {isTextArea ? (
                <>
                    <textarea
                        id={id}
                        rows={rows}
                        placeholder=" "
                        className={clsx(commonClass, "resize-y pt-2")}
                        style={{ minHeight: "120px" }}
                        {...(register ? register(name, rules) : {})}
                        value={value as string}
                        onChange={onChange as any}
                    />
                    <label htmlFor={id} className={labelClass}>
                        {label}
                    </label>
                </>
            ) : isSelect ? (
                allowMultiple || showAsBars ? (
                    <div className="relative" ref={msRef}>
                        {/* Trigger */}
                        <div
                            className={clsx(
                                commonClass,
                                "min-h-10 h-auto py-1 flex items-center gap-1 flex-wrap cursor-pointer relative"
                            )}
                            onClick={() => setMsOpen((p) => !p)}
                            role="button"
                            aria-haspopup="listbox"
                            aria-expanded={msOpen}
                        >
                            {allowMultiple && showAsBars && isValueArray && value.length > 0 ? (
                                value.map((val) => (
                                    <span
                                        key={val}
                                        className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md text-[12px] bg-gray-50"
                                    >
                                        {val}
                                        <button
                                            type="button"
                                            aria-label={`Remove ${val}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeMsValue(val);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <span
                                    className={clsx(
                                        "text-gray-600 text-[13px]",
                                        (!value || (isValueArray && value.length === 0)) &&
                                        "text-gray-400"
                                    )}
                                >
                                    {isValueArray
                                        ? value.length > 0
                                            ? value.join(", ")
                                            : selectTxt || "Select..."
                                        : (value as string) || selectTxt || "Select..."}
                                </span>
                            )}

                            {/* Chevron */}
                            <span className="ml-auto">
                                <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform ${msOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </div>

                        {/* Floating label */}
                        <label htmlFor={id} className={labelClass}>
                            {label}
                        </label>

                        {/* Dropdown */}
                        {msOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
                                {/* Search (when multiple) */}
                                {allowMultiple && (
                                    <div className="p-2 border-b">
                                        <input
                                            type="text"
                                            value={msSearch}
                                            onChange={(e) => setMsSearch(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            autoFocus
                                        />
                                    </div>
                                )}

                                <ul
                                    className="max-h-60 overflow-y-auto py-1"
                                    role="listbox"
                                    aria-label={`${label} options`}
                                >
                                    {filteredOptions.length === 0 && (
                                        <li className="px-3 py-2 text-gray-400 text-sm">No options</li>
                                    )}

                                    {/* Support grouped + flat options */}
                                    {filteredOptions.map((optGroup, i) =>
                                        typeof optGroup === "object" && optGroup.group ? (
                                            <li key={i} className="px-3 py-2">
                                                {/* Group Name */}
                                                <div className="text-gray-700 font-bold uppercase text-xs border-b border-gray-300 pb-1 mb-1">
                                                    {optGroup.group}
                                                </div>
                                                {/* Group Items */}
                                                <ul>
                                                    {optGroup.items.map((opt) => {
                                                        const selected =
                                                            (isValueArray && value.includes(opt)) ||
                                                            (!isValueArray && value === opt);

                                                        return (
                                                            <li
                                                                key={opt}
                                                                onClick={() => handleMsSelect(opt)}
                                                                className={clsx(
                                                                    "px-2 py-0.5 my-1 cursor-pointer hover:bg-blue-50 text-sm text-gray-600 flex items-center justify-between rounded",
                                                                    selected && "bg-blue-50 font-medium"
                                                                )}
                                                                role="option"
                                                                aria-selected={selected}
                                                            >
                                                                <span>{opt}</span>
                                                                {selected && (
                                                                    <CircleCheckBig size={16} color="#2cabe1" />
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </li>
                                        ) : (
                                            // Flat option
                                            (() => {
                                                const selected =
                                                    (isValueArray && value.includes(optGroup)) ||
                                                    (!isValueArray && value === optGroup);

                                                return (
                                                    <li
                                                        key={optGroup as string}
                                                        onClick={() => handleMsSelect(optGroup as string)}
                                                        className={clsx(
                                                            "px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm flex items-center justify-between rounded-md",
                                                            selected && "bg-blue-100 font-medium"
                                                        )}
                                                        role="option"
                                                        aria-selected={selected}
                                                    >
                                                        <span>{optGroup as string}</span>
                                                        {selected && (
                                                            <span className="text-[11px] text-blue-600 font-semibold">Selected</span>
                                                        )}
                                                    </li>
                                                );
                                            })()
                                        )
                                    )}

                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    // ORIGINAL NATIVE SELECT
                    <div className="relative">
                        <select
                            id={id}
                            className={clsx(commonClass, "appearance-none pr-6")}
                            {...(register ? register(name, rules) : {})}
                            defaultValue={
                                selected ? (selected as string) : selectTxt ? "" : options[0]
                            }
                            onChange={onChange as any}
                        >
                            {selectTxt.trim() !== "" && (
                                <option value="" disabled hidden>
                                    {selectTxt}
                                </option>
                            )}
                            {options.map((opt) =>
                                typeof opt === "string" ? (
                                    <option key={opt} value={opt}>{opt}</option>
                                ) : "group" in opt ? (
                                    <optgroup key={opt.group} label={opt.group}>
                                        {opt.items.map((item) =>
                                            typeof item === "string" ? (
                                                <option key={item} value={item}>{item}</option>
                                            ) : (
                                                <option key={item.value} value={item.value}>{item.label}</option>
                                            )
                                        )}
                                    </optgroup>
                                ) : (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                )
                            )}

                        </select>
                        <label htmlFor={id} className={labelClass}>
                            {label}
                        </label>

                        {/* Chevron for native select */}
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </span>
                    </div>
                )
            ) : isDate ? (

                <div className="relative calendar-wrapper">
                    <input
                        id={id}
                        type="text"
                        readOnly
                        value={
                            value
                                ? new Date(value as string).toLocaleDateString()
                                : watch?.(name)
                                    ? new Date(watch(name)).toLocaleDateString()
                                    : ""
                        }
                        placeholder=""
                        onClick={handleCalendarOpen}
                        className={clsx(commonClass)}
                    />
                    {watch?.(name) && (isDob || isExpiry) && (
                        <p className="absolute right-0 top-0 bg-primary h-full px-2 rounded-[5px] flex items-center text-white text-[12px]">
                            {isDob
                                ? `${getYearsFromDate(new Date(watch(name)))}yrs`
                                : `${getTimeUntilDate(new Date(watch(name)))}`}
                        </p>
                    )}
                    {showCalendar &&
                        createPortal(
                            <div
                                ref={calendarRef}
                                style={{
                                    position: "absolute",
                                    top: `${calendarPos.top}px`,
                                    left: `${calendarPos.left}px`,
                                    zIndex: 999999,
                                }}
                            >
                                <Calendar
                                    onChange={(date: any) => {
                                        setValue?.(name, date);
                                        setShowCalendar(false);
                                        onChange?.({ target: { name, value: date } } as any);
                                    }}
                                    value={watch?.(name) ? new Date(watch(name)) : undefined}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                />
                            </div>,
                            document.body
                        )}
                    <label htmlFor={id} className={labelClass}>
                        {label}
                    </label>
                </div>
            ) : isCheckboxGroup || isRadioGroup ? (
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
                    {groupOptions.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center space-x-2">
                            <input
                                type={isCheckboxGroup ? "checkbox" : "radio"}
                                name={name}
                                value={opt.value}
                                checked={
                                    isCheckboxGroup ? Array.isArray(value) && value.includes(opt.value) : value === opt.value
                                }
                                onChange={(e) =>
                                    isCheckboxGroup ? handleCheckboxGroupChange(opt.value) : onChange?.(e as any)
                                }
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                    ))}
                </div>
            ) : isRadio || isCheckbox ? (
                <div className="flex items-center space-x-2">
                    <input
                        id={id}
                        type={type}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        {...(register ? register(name, rules) : {})}
                        checked={register ? undefined : type === "checkbox" ? Boolean(value) : undefined}
                        onChange={onChange as any}
                    />
                    <label htmlFor={id} className="text-sm text-gray-700">
                        {label}
                    </label>
                </div>
            ) : (
                <>
                    <input
                        id={id}
                        type={inputType}
                        placeholder=" "
                        className={clsx(commonClass, type === "password" && "pr-10")}
                        {...(register ? register(name, rules) : {})}
                        value={value as string}
                        onChange={onChange as any}
                    />
                    <label htmlFor={id} className={labelClass}>
                        {label}
                    </label>
                    {type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </>
            )}

            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error.message}</p>}
        </div>
    );
};
