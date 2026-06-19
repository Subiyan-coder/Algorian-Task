import { useState } from 'react';
import api from '../api/axios';

const CreateTask = ({ assignees, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!assignedTo) {
      setFormError('Please select someone to assign this task to');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/tasks', { title, description, assignedTo });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      onTaskCreated();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {formError && <p className="error">{formError}</p>}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">Assign to...</option>
        {assignees.map((person) => (
          <option key={person._id} value={person._id}>
            {person.name} ({person.contact})
          </option>
        ))}
      </select>

      <button className='btn-primary' type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
};

export default CreateTask;