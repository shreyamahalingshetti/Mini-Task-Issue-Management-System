import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Column from '../components/Column';

function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  const handleEdit = (task) => {
    console.log('Edit task requested:', task);
  };

  const toDoTasks = tasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="board-page">
      <Navbar />

      <main className="board-container">
        {loading ? (
          <div className="board-status-message">
            <span className="spinner" /> Loading tasks...
          </div>
        ) : error ? (
          <div className="board-error-message">
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        ) : (
          <div className="board-columns">
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
    </div>
  );
}

export default Board;
