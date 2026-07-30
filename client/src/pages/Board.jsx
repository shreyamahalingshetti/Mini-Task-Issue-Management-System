import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import TaskFormModal from '../components/TaskFormModal';
import SearchFilterBar from '../components/SearchFilterBar';

// Maps column titles to their droppableId (status values)
const COLUMN_STATUS = {
  'To Do': 'To Do',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
};

function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTasks = async (search = searchQuery, priority = priorityFilter) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search && search.trim()) params.search = search.trim();
      if (priority) params.priority = priority;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(searchQuery, priorityFilter);
  }, [searchQuery, priorityFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('');
  };

  /**
   * Shared status-change function used by BOTH drag-and-drop and the dropdown.
   * Optimistically updates local state, then PATCHes the backend.
   * Reverts on failure so both UI paths stay in sync.
   */
  const changeTaskStatus = async (taskId, newStatus) => {
    // Save previous state for rollback
    const previousTasks = tasks;

    // Optimistic update — immediately reflects in both columns and dropdown
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      // Revert both the column view and the dropdown value
      setTasks(previousTasks);
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  /**
   * Drag-and-drop handler — delegates to changeTaskStatus after resolving
   * which column (status) the card was dropped into.
   */
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Dropped outside any droppable, or same position — do nothing
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    changeTaskStatus(draggableId, newStatus);
  };

  const handleDelete = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      setTasks(previousTasks);
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    if (!editingTask) {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [res.data.data, ...prev]);
    } else {
      const res = await api.put(`/tasks/${editingTask._id}`, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.data.data : t))
      );
    }
    handleCloseModal();
  };

  const toDoTasks = tasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="board-page">
      <Navbar onNewTask={handleOpenCreateModal} />

      <main className="board-container">
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          priorityValue={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onClear={handleClearFilters}
          isSearching={loading}
        />

        {loading && tasks.length === 0 ? (
          <div className="board-status-message">
            <span className="spinner" /> Loading tasks...
          </div>
        ) : error ? (
          <div className="board-error-message">
            <p>{error}</p>
            <button
              type="button"
              className="btn-retry"
              onClick={() => fetchTasks(searchQuery, priorityFilter)}
            >
              Retry
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className={`board-columns ${loading ? 'columns-loading' : ''}`}>
              <Column
                title="To Do"
                status={COLUMN_STATUS['To Do']}
                tasks={toDoTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={changeTaskStatus}
              />
              <Column
                title="In Progress"
                status={COLUMN_STATUS['In Progress']}
                tasks={inProgressTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={changeTaskStatus}
              />
              <Column
                title="Completed"
                status={COLUMN_STATUS['Completed']}
                tasks={completedTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={changeTaskStatus}
              />
            </div>
          </DragDropContext>
        )}
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
      />
    </div>
  );
}

export default Board;
