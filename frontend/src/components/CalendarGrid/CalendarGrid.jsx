import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../../redux/slices/calendarSlice";
import CalendarEvent from "../CalendarEvent/CalendarEvent";
import MoreModal from "../MoreModal/MoreModal";

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const CalendarGrid = ({
  currentDate,
  events,
  viewMode,
  onDateClick,
  onEventClick,
}) => {
  const dispatch = useDispatch();
  const [days, setDays] = useState([]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [modalEvents, setModalEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    generateDaysForView();
  }, [currentDate, viewMode]);

  const generateDaysForView = () => {
    let startOfRange = new Date(currentDate);
    let rangeLength = 1;

    if (viewMode === "day") {
      rangeLength = 1;
    } else if (viewMode === "week") {
      const day = currentDate.getDay();
      startOfRange.setDate(currentDate.getDate() - day);
      rangeLength = 7;
    } else if (viewMode === "month") {
      startOfRange = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      rangeLength = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      const firstDayOfMonth = startOfRange.getDay();
      startOfRange.setDate(startOfRange.getDate() - firstDayOfMonth);

      rangeLength = 42;
    } else if (viewMode === "year") {
      startOfRange = new Date(currentDate.getFullYear(), 0, 1);
      rangeLength = 12;
    }

    const dateArray = Array.from({ length: rangeLength }, (_, i) => {
      const date = new Date(startOfRange);

      if (viewMode === "year") {
        date.setMonth(i);
      } else {
        date.setDate(startOfRange.getDate() + i);
      }

      return date;
    });

    setDays(dateArray);
  };

  const openMoreModal = (events) => {
    setModalEvents(events);
    setShowModal(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setModalEvents([]);
    setShowModal(false);
  };

  const formatDayLabel = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDayNumber = (date) => {
    return date.getDate();
  };

  const formatMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long" });
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

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);

      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      return start <= dayEnd && end >= dayStart;
    });
  };

  const getEventsForMonth = (month) => {
    return events.filter((event) => {
      const start = new Date(event.startTime);
      return start.getMonth() === month;
    });
  };

  const getEventsForDayAndHour = (day, hour) => {
    return events.filter((event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);

      const hourStart = new Date(day);
      hourStart.setHours(hour, 0, 0, 0);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1);

      return start < hourEnd && end > hourStart;
    });
  };

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData("eventId", event._id);
    e.dataTransfer.setData("eventData", JSON.stringify(event));
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    const eventData = JSON.parse(e.dataTransfer.getData("eventData"));

    const existingEventIndex = events.findIndex(
      (event) => event._id === eventId
    );

    if (existingEventIndex !== -1) {
      const originalStart = new Date(eventData.startTime);
      const originalEnd = new Date(eventData.endTime);
      const durationMs = originalEnd.getTime() - originalStart.getTime();

      const newStart = new Date(day);
      if (hour !== undefined) {
        newStart.setHours(hour, 0, 0, 0);
      } else {
        newStart.setHours(
          originalStart.getHours(),
          originalStart.getMinutes(),
          originalStart.getSeconds(),
          originalStart.getMilliseconds()
        );
      }

      const newEnd = new Date(newStart.getTime() + durationMs);

      dispatch(
        updateEvent({
          ...eventData,
          startTime: newStart,
          endTime: newEnd,
        })
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (viewMode === "day") {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="border-b border-gray-400/70 p-4 text-center">
          <h2
            className={`text-xl font-semibold ${
              isToday(days[0]) ? "text-blue-600" : ""
            }`}
          >
            {days[0]?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        </div>
        <div className="grid grid-cols-1 flex-1 overflow-auto">
          {hours.map((hour) => {
            const hourEvents = getEventsForDayAndHour(days[0], hour);

            return (
              <div
                key={hour}
                className="border-b border-gray-400/70 flex"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, days[0], hour)}
              >
                <div className="w-24 p-2 text-xs text-gray-500 border-r border-gray-400/70">
                  {formatHour(hour)}
                </div>
                <div
                  className="flex-1 min-h-16 p-1 cursor-pointer"
                  onClick={() => onDateClick(days[0], hour)}
                >
                  {hourEvents.map((event) => (
                    <CalendarEvent
                      key={event._id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      onDragStart={(e) => handleDragStart(e, event)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (viewMode === "week") {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="grid grid-cols-8 border-b border-gray-400/70">
          <div className="h-14"></div>
          {days.map((day, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center p-2 ${
                isToday(day) ? "bg-blue-100 rounded" : ""
              }`}
            >
              <div className="text-sm font-medium text-gray-500">
                {formatDayLabel(day)}
              </div>
              <div className="text-lg font-semibold">
                {formatDayNumber(day)}
              </div>
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
                  const MAX_EVENTS_PER_CELL = 1;
                  const showEvents = dayEvents.slice(0, MAX_EVENTS_PER_CELL);
                  const extraCount = dayEvents.length - MAX_EVENTS_PER_CELL;

                  return (
                    <div
                      key={hour}
                      className="h-16 border-b relative cursor-pointer flex flex-col gap-1 p-1"
                      onClick={() => onDateClick(day, hour)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day, hour)}
                    >
                      {showEvents.map((event) => (
                        <CalendarEvent
                          key={event._id}
                          event={event}
                          onClick={() => onEventClick(event)}
                          onDragStart={(e) => handleDragStart(e, event)}
                        />
                      ))}
                      {extraCount > 0 && (
                        <div
                          className="text-xs text-blue-600 hover:underline cursor-pointer mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMoreModal(dayEvents);
                          }}
                        >
                          +{extraCount} more
                        </div>
                      )}
                      {showModal && (
                        <MoreModal events={modalEvents} onClose={closeModal} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (viewMode === "month") {
    const weekCount = Math.ceil(days.length / 7);

    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="text-center p-4 border-b border-gray-400/70">
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-400/70">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-rows-6">
          {Array.from({ length: weekCount }).map((_, weekIndex) => (
            <div
              key={weekIndex}
              className="grid grid-cols-7 border-b border-gray-400/70"
            >
              {days
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((day, dayIndex) => {
                  const dayEvents = getEventsForDay(day);
                  const MAX_EVENTS_PER_CELL = 3;
                  const showEvents = dayEvents.slice(0, MAX_EVENTS_PER_CELL);
                  const extraCount = dayEvents.length - MAX_EVENTS_PER_CELL;
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();

                  return (
                    <div
                      key={dayIndex}
                      className={`border-r border-gray-400/70 min-h-24 p-1 ${
                        isCurrentMonth ? "bg-white" : "bg-gray-100"
                      }`}
                      onClick={() => onDateClick(day)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day)}
                    >
                      <div
                        className={`flex items-center justify-center text-right text-sm p-1 ${
                          isToday(day)
                            ? "text-white bg-blue-500 w-6 h-6 rounded-full text-center"
                            : isCurrentMonth
                            ? "font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="flex flex-col gap-1">
                        {showEvents.map((event) => (
                          <CalendarEvent
                            key={event._id}
                            event={event}
                            compact={true}
                            onClick={() => onEventClick(event)}
                            onDragStart={(e) => handleDragStart(e, event)}
                          />
                        ))}
                        {extraCount > 0 && (
                          <div
                            className="text-xs text-blue-600 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openMoreModal(dayEvents);
                            }}
                          >
                            +{extraCount} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        {showModal && <MoreModal events={modalEvents} onClose={closeModal} />}
      </div>
    );
  } else if (viewMode === "year") {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="text-center p-4 border-b border-gray-400/70">
          <h2 className="text-2xl font-bold">{currentDate.getFullYear()}</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4 md:grid-cols-4">
          {days.map((monthDate, index) => {
            const monthEvents = getEventsForMonth(index);
            const eventCount = monthEvents.length;

            return (
              <div
                key={index}
                className={`border rounded shadow p-2 cursor-pointer ${
                  index === new Date().getMonth()
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : ""
                }`}
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(index);
                  onDateClick(newDate);
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(index, 1);
                  handleDrop(e, newDate);
                }}
              >
                <h3 className="text-center font-medium">
                  {formatMonthName(monthDate)}
                </h3>
                <div className="text-center mt-2">
                  {eventCount > 0 && (
                    <div className="text-xs text-blue-600">
                      {eventCount} event{eventCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default CalendarGrid;
