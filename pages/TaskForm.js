// TaskForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    taskName: '',
    deadline: null,
    priority: '',
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      taskName: formData.taskName,
      deadline: formData.deadline ? formData.deadline.toISOString() : '',
      priority: formData.priority,
    });
    setFormData({
      taskName: '',
      deadline: null,
      priority: '',
    });
  };

  const formFields = [
    { id: 'taskName', label: 'Task Name', type: 'text' },
    { id: 'deadline', label: 'Deadline', type: 'datepicker' },
    { id: 'priority', label: 'Priority', type: 'select' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <div key={field.id} className="mb-3">
          <label htmlFor={field.id} className="form-label">
            {field.label}
          </label>
          {field.type === 'datepicker' ? (
            <DatePicker
              className="form-control"
              selected={formData[field.id]}
              onChange={(date) => handleChange(field.id, date)}
            />
          ) : field.type === 'select' ? (
            <select
              className="form-select"
              id={field.id}
              value={formData[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          ) : (
            <input
              type={field.type}
              className="form-control"
              id={field.id}
              value={formData[field.id]}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <button type="submit" className="btn btn-primary">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
