import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals } from "../../redux/slices/calendarSlice";

const API_URL = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [tasks, setTasks] = useState({});
  const dispatch = useDispatch();
  const { goals = [] } = useSelector((state) => state.calendar);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", selectedGoal],
    queryFn: async () => {
      if (!selectedGoal) return [];
      const response = await axios.get(
        `${API_URL}/tasks?goalId=${selectedGoal}`
      );
      return response.data;
    },
    enabled: !!selectedGoal,
  });

  useEffect(() => {
    if (tasksData && selectedGoal) {
      const tasksArray = Array.isArray(tasksData) ? tasksData : [];
      console.log("Tasks received:", tasksArray);
      setTasks((prev) => ({
        ...prev,
        [selectedGoal]: tasksArray,
      }));
    }
  }, [tasksData, selectedGoal]);

  const handleGoalClick = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
  };

  const getGoalColor = (goalId) => {
    const goal = Array.isArray(goals)
      ? goals.find((g) => g._id === goalId)
      : null;
    return goal?.color || "#3498db";
  };

  return (
    <div className="w-64 h-full bg-white shadow-md flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">My Calendar</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 mb-3 tracking-wider">
            GOALS
          </h3>
          <ul className="space-y-2">
            {!Array.isArray(goals) || goals.length === 0 ? (
              <div className="py-2 px-3 bg-gray-100 rounded">
                No goals available
              </div>
            ) : (
              goals.map((goal) => (
                <li
                  key={goal._id}
                  className={`py-2 px-3 rounded cursor-pointer transition-all ${
                    selectedGoal === goal._id ? "shadow-md" : "hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor:
                      selectedGoal === goal._id
                        ? `${goal.color}20`
                        : "transparent",
                    borderLeft: `4px solid ${goal.color || "#3498db"}`,
                  }}
                  onClick={() => handleGoalClick(goal._id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.name}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: goal.color || "#3498db" }}
                    ></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {selectedGoal && (
          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-3 tracking-wider">
              TASKS
            </h3>
            <ul className="space-y-2">
              {tasksLoading ? (
                <div className="py-2 px-3 bg-gray-100 rounded animate-pulse">
                  Loading tasks...
                </div>
              ) : tasks[selectedGoal] &&
                Array.isArray(tasks[selectedGoal]) &&
                tasks[selectedGoal].length > 0 ? (
                tasks[selectedGoal].map((task) => {
                  // Handle the case where goalId might be an object from MongoDB
                  const goalId =
                    typeof task.goalId === "object" && task.goalId.$oid
                      ? task.goalId.$oid
                      : typeof task.goalId === "object" && task.goalId._id
                      ? task.goalId._id
                      : task.goalId;

                  const goalColor = getGoalColor(goalId);
                  return (
                    <li
                      key={task._id.$oid || task._id}
                      className="py-2 px-3 bg-white rounded border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-all"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      style={{
                        borderLeft: `4px solid ${goalColor}`,
                        backgroundColor: `${goalColor}20` || "#3498db",
                      }}
                    >
                      <span>{task.name}</span>
                    </li>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 italic py-2">
                  No tasks for this goal
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
