import React, { useState, useEffect } from 'react';

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setPriority(initialData.priority || 'Medium');
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
      }
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle.length < 3) {
      newErrors.title = 'Title is required and must be at least 3 characters';
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      newErrors.priority = 'Priority must be one of: Low, Medium, High';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.response?.data?.message || 'An error occurred while saving the task.',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        {errors.submit && <div className="alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'input-error' : ''}
              disabled={submitting}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              placeholder="Enter task description (optional)"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority *</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={errors.priority ? 'input-error' : ''}
              disabled={submitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && (
              <span className="field-error">{errors.priority}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary btn-submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : isEditMode
                ? 'Save Changes'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
