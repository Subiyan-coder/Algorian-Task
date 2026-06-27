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
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchTasks = async (pageNum = 1, status = statusFilter, by = sortBy, order = sortOrder) => {
      console.log('fetchTasks called with:', { pageNum, status, by, order });
      setLoading(true);

      try {
        const statusParam = status ? `&status=${status}` : '';
        const sortParam = `&sortBy=${by}&sortOrder=${order}`;
        const { data } = await api.get(`/tasks?page=${pageNum}&limit=4${statusParam}${sortParam}&_t=${Date.now()}`);
        console.log('response tasks:', data.data.tasks.map(t => t.title));

        setTasks(data.data.tasks);
        setTotalPages(data.data.totalPages);
        setPage(data.data.page);

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
      setAssignees(data.data);
    } catch (err) {
      console.error(err);
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