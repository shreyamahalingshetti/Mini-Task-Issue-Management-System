import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

function Column({ title, status, tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="board-column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="count-badge">{tasks.length}</span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            className={`column-content${snapshot.isDraggingOver ? ' column-drop-active' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
              <div className="empty-column-placeholder">No tasks here</div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
