import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];

function TaskCard({ task, index, onEdit, onDelete, onStatusChange }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':   return 'badge-priority badge-high';
      case 'Medium': return 'badge-priority badge-medium';
      case 'Low':    return 'badge-priority badge-low';
      default:       return 'badge-priority badge-medium';
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card${snapshot.isDragging ? ' task-card--dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {/*
            Drag handle is ONLY the header strip.
            Buttons, dropdown, and description are outside it and remain freely clickable.
          */}
          <div
            className="task-card-header task-drag-handle"
            {...provided.dragHandleProps}
          >
            <h4 className="task-title">{task.title}</h4>
            <span className={getPriorityClass(task.priority)}>{task.priority}</span>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-card-footer">
            {/* Status dropdown — calls the same changeTaskStatus as DnD */}
            <div className="status-select-wrapper">
              <select
                className="status-select"
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                // Prevent mousedown from bubbling up to the drag handle
                onMouseDown={(e) => e.stopPropagation()}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="task-actions">
              <button
                type="button"
                className="btn-icon btn-edit"
                onClick={() => onEdit(task)}
                onMouseDown={(e) => e.stopPropagation()}
                title="Edit Task"
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-icon btn-delete"
                onClick={handleDelete}
                onMouseDown={(e) => e.stopPropagation()}
                title="Delete Task"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
