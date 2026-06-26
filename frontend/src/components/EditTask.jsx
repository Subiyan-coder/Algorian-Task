import { useState } from 'react';
import api from '../api/axios';

const EditTask = ({ task, isCreator, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    remarks: task.remarks || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/tasks/${task._id}`, form);
      onSaved();
    } catch (err) {
        const message = err.response?.data?.message || 'Update failed';
        const errors = err.response?.data?.errors || [];
        setError(errors.length > 0 ? errors.join(', ') : message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td colSpan="6">
        {isCreator && (
          <>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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

        <input
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
};

export default EditTask;