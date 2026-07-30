import React from 'react';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-priority badge-high';
      case 'Medium':
        return 'badge-priority badge-medium';
      case 'Low':
        return 'badge-priority badge-low';
      default:
        return 'badge-priority badge-medium';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={getPriorityClass(task.priority)}>{task.priority}</span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="status-select-wrapper">
          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="btn-icon btn-edit"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-icon btn-delete"
            onClick={handleDelete}
            title="Delete Task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
