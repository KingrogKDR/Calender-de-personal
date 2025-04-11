import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState("month");

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white">
      <div className="flex items-center gap-8">
        <div
          onClick={goToToday}
          className="px-2 py-1 flex items-center gap-5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-300"
        >
          <button
            onClick={goToPreviousWeek}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span>Today</span>
          <button
            onClick={goToNextWeek}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={`${viewMode === "day" ? "active" : ""} view-options-button`}
          onClick={() => setViewMode("day")}
        >
          Day
        </button>
        <button
          className={`${viewMode === "week" ? "active" : ""} view-options-button`}
          onClick={() => setViewMode("week")}
        >
          Week
        </button>
        <button
          className={`${viewMode === "month" ? "active" : ""} view-options-button`}
          onClick={() => setViewMode("month")}
        >
          Month
        </button>
        <button
          className={`${viewMode === "year" ? "active" : ""} view-options-button`}
          onClick={() => setViewMode("year")}
        >
          Year
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
