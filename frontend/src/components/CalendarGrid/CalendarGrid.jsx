import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../../redux/slices/calendarSlice";
import CalendarEvent from "../CalendarEvent/CalendarEvent";

const CalendarGrid = ({ events, onDateClick, onEventClick }) => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    setDays(weekDays);
  }, [currentDate]);

  const formatDayLabel = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayNumber = (date) => {
    return date.getDate();
  };

  const formatHour = (hour) => {
    return hour === 0
      ? "12 AM"
      : hour === 12
      ? "12 PM"
      : hour < 12
      ? `${hour} AM`
      : `${hour - 12} PM`;
  };

  const getEventsForDayAndHour = (day, hour) => {
    return events.filter((event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);

      const hourStart = new Date(day);
      hourStart.setHours(hour, 0, 0, 0);
      hourStart.setMinutes(0);
      hourStart.setSeconds(0);
      hourStart.setMilliseconds(0);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1);

      return start < hourEnd && end > hourStart;

    //   console.log(
    //     event.title,
    //     "start:",
    //     start.toString(),
    //     "end:",
    //     end.toString(),
    //     "hourStart:",
    //     hourStart.toString(),
    //     "hourEnd:",
    //     hourEnd.toString(),
    //     "included:",
    //     included
    //   );

    //   return included;
    });
  };

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData("event", JSON.stringify(event));
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData("event"));

    const originalStart = new Date(eventData.startTime);
    const originalEnd = new Date(eventData.endTime);
    const durationMs = originalEnd.getTime() - originalStart.getTime();

    const newStart = new Date(day);
    newStart.setHours(hour);
    newStart.setMinutes(0);
    newStart.setSeconds(0);

    const newEnd = new Date(newStart.getTime() + durationMs);

    dispatch(
      updateEvent({
        ...eventData,
        startTime: newStart,
        endTime: newEnd,
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <div className="grid grid-cols-8 border-b border-gray-400/70">
        <div className=" h-14"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2"
          >
            <div className="text-sm font-medium text-gray-500">
              {formatDayLabel(day)}
            </div>
            <div className="text-lg font-semibold">{formatDayNumber(day)}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8 flex-1 overflow-auto">
        <div className="col-span-1 border-r border-gray-400/70">
          {hours.map((hour) => (
            <div key={hour} className="h-16 relative">
              <span className="absolute -top-3 left-2 text-xs text-gray-500">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>
        <div className="col-span-7 grid grid-cols-7">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-400/70">
              {hours.map((hour) => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                // console.log("Day events:", dayEvents);
                return (
                  <div
                    key={hour}
                    className="h-16 border-b relative cursor-pointer"
                    onClick={() => onDateClick(day, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                    {dayEvents.map((event) => (
                      <CalendarEvent
                        key={event._id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        onDragStart={(e) => handleDragStart(e, event)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
