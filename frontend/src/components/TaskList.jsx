import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EditTask from './EditTask';
import api from '../api/axios';

const TaskList = ({ tasks, onTaskUpdated, sortBy, sortOrder, onSort }) => {
  const { user } = useAuth();
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
        await api.delete(`/tasks/${taskId}`);
        onTaskUpdated();
    } catch (err) {
        console.error(err);
    }
  };

  const getSortArrow = (column) => {
    if (sortBy !== column) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th className="sortable" onClick={() => onSort('title')}>
            Title {getSortArrow('title')}
          </th>
          <th>Description</th>
          <th className="sortable" onClick={() => onSort('status')}>
            Status {getSortArrow('status')}
          </th>
          <th>Remarks</th>
          <th className="sortable" onClick={() => onSort('createdAt')}>
            Created By {getSortArrow('createdAt')}
          </th>
          <th className="sortable" onClick={() => onSort('assignedTo')} >
             Assigned To {getSortArrow('assignedTo')}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 && (
          <tr>
            <td colSpan="6">No tasks found</td>
          </tr>
          
        )}

        {tasks.map((task) => {
          const isCreator = task.createdBy?._id === user._id;
          const isEditing = editingTaskId === task._id;
          
          if (isEditing) {
            return (
              <EditTask
                key={task._id}
                task={task}
                isCreator={isCreator}
                onCancel={() => setEditingTaskId(null)}
                onSaved={() => {
                  setEditingTaskId(null);
                  onTaskUpdated();
                }}
              />
            );
          }

          return (
            <tr className='edit-row' key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <span className={`badge ${task.status}`}>{task.status}</span>
              </td>
              <td>{task.remarks || '—'}</td>
              <td>{task.createdBy?.name}</td>
              <td>{task.assignedTo?.name}</td>
              <td>
                <button className='btn-secondary' onClick={() => setEditingTaskId(task._id)}>Edit</button>
                {isCreator && (
                  <button className='btn-danger' onClick={() => handleDelete(task._id)}>Delete</button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaskList;