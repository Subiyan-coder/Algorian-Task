import { useState } from 'react';
import api from '../api/axios';
import { createTaskSchema, getZodErrors } from '../utils/validationSchemas';

const CreateTask = ({ assignees, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!assignedTo) {
      setErrors('Please select someone to assign this task to');
      return;
    }

    setSubmitting(true);

    const result = createTaskSchema.safeParse({ title, description, assignedTo });
      if (!result.success) {
        setErrors(getZodErrors(result.error));
        setSubmitting(false);
        return;
      }

    try {
      await api.post('/tasks', { title, description, assignedTo });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      onTaskCreated();
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create task';
      const backendErrors = err.response?.data?.errors || [];
      setErrors({
        general: backendErrors.length > 0 ? backendErrors.join(', ') : message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {errors.general && <p className="error">{errors.general}</p>}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <p className="error">{errors.title}</p>}

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <p className="error">{errors.description}</p>}

      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">Assign to...</option>
        {assignees.map((person) => (
          <option key={person._id} value={person._id}>
            {person.name} ({person.contact})
          </option>
        ))}
      </select>
      {errors.assignedTo && <p className="error">{errors.assignedTo}</p>}

      <button className='btn-primary' type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
};

export default CreateTask;