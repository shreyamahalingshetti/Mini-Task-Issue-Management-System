import React from 'react';
import TaskCard from './TaskCard';

function Column({ title, tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="board-column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="count-badge">{tasks.length}</span>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-column-placeholder">No tasks here</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Column;
