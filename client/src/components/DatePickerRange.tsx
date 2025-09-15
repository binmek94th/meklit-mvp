import React, { useState, useRef, useEffect } from "react";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface RangeDatePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    placeholder?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({
                                                             value = { startDate: null, endDate: null },
                                                             onChange,
                                                             placeholder = "Select date range",
                                                             disabled = false,
                                                             minDate,
                                                             maxDate,
                                                             className = "",
                                                         }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        value.startDate ?? new Date()
    );
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    const getDisplayText = () => {
        if (value.startDate && value.endDate) {
            return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
        } else if (value.startDate) {
            return `${formatDate(value.startDate)} - Select end date`;
        }
        return placeholder;
    };

    const getDaysInMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getFirstDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const isSameDay = (date1: Date, date2: Date) =>
        date1.toDateString() === date2.toDateString();

    const isDateInRange = (date: Date) => {
        if (!value.startDate || !value.endDate) return false;
        return date >= value.startDate && date <= value.endDate;
    };

    const isDateInHoverRange = (date: Date) => {
        if (!value.startDate || !hoveredDate || value.endDate) return false;
        const start = value.startDate.getTime();
        const end = hoveredDate.getTime();
        return (
            date.getTime() >= Math.min(start, end) &&
            date.getTime() <= Math.max(start, end)
        );
    };

    const isDateDisabled = (date: Date) => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        if (!value.startDate || (value.startDate && value.endDate)) {
            // Start new selection
            onChange?.({ startDate: date, endDate: null });
        } else if (value.startDate && !value.endDate) {
            // Complete the range
            if (date >= value.startDate) {
                onChange?.({ startDate: value.startDate, endDate: date });
                setIsOpen(false);
            } else {
                // reset if clicked before startDate
                onChange?.({ startDate: date, endDate: null });
            }
        }
    };

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));

            // lock navigation if min/max
            if (minDate && newMonth < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) {
                return prev;
            }
            if (maxDate && newMonth > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) {
                return prev;
            }
            return newMonth;
        });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days: JSX.Element[] = [];

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Real days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
            );
            const isToday = isSameDay(date, new Date());
            const isSelected =
                (value.startDate && isSameDay(date, value.startDate)) ||
                (value.endDate && isSameDay(date, value.endDate));
            const isInRange = isDateInRange(date);
            const isInHoverRange = isDateInHoverRange(date);
            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    disabled={isDisabled}
                    aria-label={`Select ${formatDate(date)}`}
                    className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 hover:text-blue-600 cursor-pointer"}
            ${isToday && !isSelected ? "bg-blue-100 text-blue-600 font-semibold" : ""}
            ${isSelected ? "bg-blue-500 text-white shadow-md transform scale-105" : ""}
            ${(isInRange || isInHoverRange) && !isSelected ? "bg-blue-100 text-blue-600" : ""}
          `}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const clearSelection = () => {
        onChange?.({ startDate: null, endDate: null });
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input */}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
          w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400 cursor-pointer"}
          ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
        `}
            >
                <div className="flex items-center justify-between">
          <span className={value.startDate ? "text-gray-900" : "text-gray-500"}>
            {getDisplayText()}
          </span>
                    <div className="flex items-center space-x-2">
                        {(value.startDate || value.endDate) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearSelection();
                                }}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        )}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Calendar */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 min-w-[320px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigateMonth("prev")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            ←
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {currentMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h3>
                        <button
                            onClick={() => navigateMonth("next")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            →
                        </button>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                            <div
                                key={day}
                                className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">{renderCalendar()}</div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            {value.startDate && value.endDate
                                ? `${Math.ceil(
                                    (value.endDate.getTime() - value.startDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) + 1} days selected`
                                : value.startDate
                                    ? "Select end date"
                                    : "Select start date"}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={clearSelection}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RangeDatePicker;
