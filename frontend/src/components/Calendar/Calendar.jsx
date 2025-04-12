import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import EventModal from "../EventModal/EventModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../redux/slices/calendarSlice";

const Calendar = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.calendar);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDateClick = (date, hour) => {
    const start = new Date(date);
    start.setHours(hour);
    start.setMinutes(0);

    const end = new Date(date);
    end.setHours(hour + 1);
    end.setMinutes(0);

    setSelectedDate(date);
    setSelectedTime({ start, end });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <CalendarGrid
          events={events}
          currentDate={currentDate}
          viewMode={viewMode}
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
      </div>
      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={handleCloseModal}
          event={selectedEvent}
          initialDate={selectedDate}
          initialTime={selectedTime}
        />
      )}
    </div>
  );
};

export default Calendar;
