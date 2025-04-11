import React, { useState } from 'react';

const Sidebar = ({ onTaskDrag }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const goals = [
    { id: '1', name: 'Be fit', color: '#e74c3c' },
    { id: '2', name: 'Academics', color: '#3498db' },
    { id: '3', name: 'LEARN', color: '#f2c1e7' },
    { id: '4', name: 'Sports', color: '#2ecc71' }
  ];
  
  const tasks = {
    '1': [
      { id: 't1', name: 'Morning Run', goalId: '1' },
      { id: 't2', name: 'Gym Session', goalId: '1' },
      { id: 't3', name: 'Yoga', goalId: '1' }
    ],
    '2': [
      { id: 't4', name: 'Study Math', goalId: '2' },
      { id: 't5', name: 'Read Article', goalId: '2' }
    ],
    '3': [
      { id: 't6', name: 'AI based agents', goalId: '3' },
      { id: 't7', name: 'MLE', goalId: '3' },
      { id: 't8', name: 'DE related', goalId: '3' },
      { id: 't9', name: 'Basics', goalId: '3' }
    ],
    '4': [
      { id: 't10', name: 'Basketball Practice', goalId: '4' },
      { id: 't11', name: 'Swimming', goalId: '4' }
    ]
  };

  const handleGoalClick = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    if (onTaskDrag) {
      onTaskDrag(task);
    }
  };

  return (
    <div className="sidebar">
      <div className="goals-section">
        <h3>GOALS</h3>
        <ul className="goals-list">
          {goals.map(goal => (
            <li 
              key={goal.id}
              className={`goal-item ${selectedGoal === goal.id ? 'selected' : ''}`}
              style={{ backgroundColor: goal.color }}
              onClick={() => handleGoalClick(goal.id)}
            >
              <span className="goal-name">{goal.name}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {selectedGoal && (
        <div className="tasks-section">
          <h3>TASKS</h3>
          <ul className="tasks-list">
            {tasks[selectedGoal]?.map(task => (
              <li 
                key={task.id}
                className="task-item"
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                style={{ 
                  borderLeftColor: goals.find(g => g.id === task.goalId)?.color 
                }}
              >
                <span className="task-name">{task.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;