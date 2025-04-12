import React from "react";
import { X } from "lucide-react";

const MoreModal = ({ events, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="bg-white rounded-xl shadow shadow-gray-100 p-4 w-[90%] max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Events</h2>

        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-3 rounded border-l-4 shadow-sm"
              style={{
                borderLeftColor:
                  {
                    exercise: "#4ade80",
                    eating: "#facc15",
                    work: "#3b82f6",
                    relax: "#a78bfa",
                    family: "#f472b6",
                    social: "#ef4444",
                  }[event.category] || "#9ca3af",
              }}
            >
              <div className="font-medium text-sm">{event.title}</div>
              <div className="text-xs text-gray-600">
                {new Date(event.startTime).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(event.endTime).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Category: {event.category}
              </div>
              {event.goalId && (
                <div className="text-xs text-gray-500">
                  Goal: {event.goalId}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreModal;
