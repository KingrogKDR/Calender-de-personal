import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
}) => {
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "year") {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToPreviousPeriod = (e) => {
    if (e) {
      e.stopPropagation();
    }

    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "year") {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const formatCurrentViewDate = () => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      const day = currentDate.getDay();
      startOfWeek.setDate(currentDate.getDate() - day);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endOfWeek.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    } else if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={goToToday}
          className="px-4 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
        >
          Today
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousPeriod}
            className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-base font-medium min-w-32 text-center">
            {formatCurrentViewDate()}
          </span>

          <button
            onClick={goToNextPeriod}
            className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            className={`px-3 py-1 text-sm ${
              viewMode === "day"
                ? "active"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 text-sm border-l border-gray-300 ${
              viewMode === "week"
                ? "active"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm border-l border-gray-300 ${
              viewMode === "month"
                ? "active"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm border-l border-gray-300 ${
              viewMode === "year"
                ? "active"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setViewMode("year")}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
