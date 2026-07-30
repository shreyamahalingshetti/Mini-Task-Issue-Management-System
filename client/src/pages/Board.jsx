import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import TaskFormModal from '../components/TaskFormModal';
import SearchFilterBar from '../components/SearchFilterBar';

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

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

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
      // Create mode
      const res = await api.post('/tasks', taskData);
      setTasks((prevTasks) => [res.data.data, ...prevTasks]);
    } else {
      // Edit mode
      const res = await api.put(`/tasks/${editingTask._id}`, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === editingTask._id ? res.data.data : t))
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
          <div className={`board-columns ${loading ? 'columns-loading' : ''}`}>
            <Column
              title="To Do"
              tasks={toDoTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <Column
              title="In Progress"
              tasks={inProgressTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <Column
              title="Completed"
              tasks={completedTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
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
