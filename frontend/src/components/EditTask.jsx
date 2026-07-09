import { useState } from 'react';
import api from '../api/axios';
import { updateTaskSchema, getZodErrors } from '../utils/validationSchemas';
import FormInput from './FormInput';
import Alert from './Alert';

const EditTask = ({ task, isCreator, onCancel, onSaved }) => {

  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    remarks: task.remarks || ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSave = async () => {
    setSaving(true);
    const result = updateTaskSchema.safeParse(form);
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      setSaving(false);
      return;
    }

    try {
      await api.put(`/tasks/${task._id}`, form);
      onSaved();
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      const backendErrors = err.response?.data?.errors || [];
      setErrors({
        general: backendErrors.length > 0 ? backendErrors.join(', ') : message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td colSpan="6">
        {errors.general && <Alert type="error" message={errors.general}/>}

        {isCreator && (
          <>
            <FormInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={errors.title}
              touched={true}
              placeholder="Title"
            />

            <FormInput
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={errors.description}
              touched={true}
              placeholder="Description"
            />

          </>
        )}

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="unable-to-complete">Unable to Complete</option>
        </select>

        <FormInput
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          error={errors.remarks}
          touched={true}
        />

        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
};

export default EditTask;