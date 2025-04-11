import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../../redux/slices/calendarSlice';
import { X } from 'lucide-react';

const CategoryColors = {
  exercise: 'bg-green-200 border-green-400',
  eating: 'bg-yellow-200 border-yellow-400',
  work: 'bg-blue-200 border-blue-400',
  relax: 'bg-purple-200 border-purple-400',
  family: 'bg-pink-200 border-pink-400',
  social: 'bg-red-200 border-red-400'
};


const CalendarEvent = ({ event, onClick, onDragStart }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const formatTime = (date) => {
    const d = new Date(date); 
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  const calculateHeight = () => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const heightPerMinute = 64 / 60; 
    return Math.max(durationMinutes * heightPerMinute, 16); 
  };

  const colorClass = CategoryColors[event.category] || 'bg-gray-200 border-gray-500';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (event._id) {
      dispatch(deleteEvent(event._id));
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div
      className={`absolute left-0 right-0 mx-1 p-1 border-l-4 rounded shadow-sm overflow-hidden ${colorClass} ${expanded ? 'z-10' : ''}`}
      style={{ 
        height: `${calculateHeight()}px`
      }}
      onClick={onClick}
      onDoubleClick={toggleExpand}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium truncate text-sm">{event.title}</div>
        <button onClick={handleDelete} className="text-gray-500 hover:text-gray-700">
          <X size={14} />
        </button>
      </div>
      <div className="text-xs text-gray-600">
        {formatTime(event.startTime)} - {formatTime(event.endTime)}
      </div>
      {expanded && (
        <div className="text-xs mt-1">
          <div>Category: {event.category}</div>
          {event.goalId && <div>Goal: {event.goalId}</div>}
        </div>
      )}
    </div>
  );
};

export default CalendarEvent;