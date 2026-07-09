import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateTask from '../components/CreateTask';
import TaskList from '../components/TaskList';
import Pagination from '../components/Pagination';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [alert, setAlert] = useState({type: '', message: ''});

  const fetchTasks = async (pageNum = 1, status = statusFilter, by = sortBy, order = sortOrder) => {
      setLoading(true);

      try {
        const statusParam = status ? `&status=${status}` : '';
        const sortParam = `&sortBy=${by}&sortOrder=${order}`;
        const { data } = await api.get(`/tasks?page=${pageNum}&limit=4${statusParam}${sortParam}`);

        setTasks(data.data.tasks);
        setTotalPages(data.data.totalPages);
        setPage(data.data.page);

      }catch (err) {
            setAlert({
                type: 'error',
                message:
                    err.response?.data?.message ||
                    'Unable to load Users.'
            });
      } finally {
        setLoading(false);
      }
  };

  const fetchAssignees = async () => {
    const targetRole = user.role === 'admin' ? 'staff' : 'admin';
    try {
      const { data } = await api.get(`/users?role=${targetRole}`);
      setAssignees(data.data);
    } catch (err) {
    setAlert({
        type: 'error',
        message:
            err.response?.data?.message ||
            'Unable to load tasks.'
      });
    }
  };

  const handleSort = (column) => {

    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newOrder);
    fetchTasks(1, statusFilter, column, newOrder);
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

      <div className="filter-sort-bar">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchTasks(1, e.target.value);
          }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="unable-to-complete">Unable to Complete</option>
        </select>

        {statusFilter && (
          <button onClick={() => {
            setStatusFilter('');
            fetchTasks(1, '');
          }}>
            Clear Filter
          </button>
        )}
      </div>

      <Alert
          type={alert.type}
          message={alert.message}
      />

      <CreateTask assignees={assignees} onTaskCreated={() => fetchTasks(1)} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onTaskUpdated={() => fetchTasks(page)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          
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