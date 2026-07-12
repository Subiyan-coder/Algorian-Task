import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { createTaskSchema, getZodErrors } from '../utils/validationSchemas';
import FormInput from './FormInput';

const CreateTask = ({ assignees, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [touched, setTouched] = useState({ title: false, description: false, assignedTo: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateField = (field, value) => {
    const formData = { title, description, assignedTo, [field]: value };
    const result = createTaskSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = getZodErrors(result.error);
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (field, value, setter) => {
    setter(value);
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, description: true, assignedTo: true });

    const result = createTaskSchema.safeParse({ title, description, assignedTo });
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/tasks', { title, description, assignedTo });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setErrors({});
      setTouched({ title: false, description: false, assignedTo: false });
      toast.success('Task created successfully!');
      onTaskCreated();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to create task.';
      const backendErrors = err.response?.data?.errors || [];
      toast.error(
        backendErrors.length > 0
          ? backendErrors.join(', ')
          : message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
       <h3>Create New Task</h3>
      <form onSubmit={handleSubmit} className="task-form">

        <FormInput
          placeholder="Title"
          value={title}
          onChange={(e) => handleChange('title', e.target.value, setTitle)}
          error={errors.title}
          touched={touched.title}
        />

        <FormInput
          placeholder="Description"
          value={description}
          onChange={(e) => handleChange('description', e.target.value, setDescription)}
          error={errors.description}
          touched={touched.description}
        />

        <div className="input-wrapper">
          <select
            value={assignedTo}
            onChange={(e) => handleChange('assignedTo', e.target.value, setAssignedTo)}
            className={touched.assignedTo ? (errors.assignedTo ? 'invalid' : 'valid') : ''}
          >
            <option value="">Assign to...</option>
            {assignees.map((person) => (
              <option key={person._id} value={person._id}>
                {person.name} ({person.email})
              </option>
            ))}
          </select>
          {touched.assignedTo && errors.assignedTo && (
            <p className="field-error">{errors.assignedTo}</p>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;