import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateTask from '../components/CreateTask';
import TaskList from '../components/TaskList';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks?page=${pageNum}&limit=4`);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async () => {
    const targetRole = user.role === 'admin' ? 'staff' : 'admin';
    try {
      const { data } = await api.get(`/users?role=${targetRole}`);
      setAssignees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks(1);
    fetchAssignees();
  }, []);

  if (!user) return null;

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}</h2>
      <h3>My Tasks</h3>

      <CreateTask assignees={assignees} onTaskCreated={() => fetchTasks(1)} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <TaskList tasks={tasks} onTaskUpdated={() => fetchTasks(page)} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={fetchTasks}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;