require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorResponse } = require('./utils/apiResponse')

connectDB();

const app = express();
app.use(cors({
  origin: [
    'https://algorian-task.vercel.app',
    'https://algorian-task-git-main-subiyan-coders-projects.vercel.app',
    'https://algorian-task-fbjpkpdnt-subiyan-coders-projects.vercel.app',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

app.get('/', (req, res) => {
   res.send('API is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  console.error(err.stack);

  if (err.name === 'ValidationError' ){
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse (res, 400, 'Validation failed', errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse (res, 400, `${field} already exists`, []);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Token has expired. Please log in again', []);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse ( res, 400, 'Token has Expired', []);
  }

  return errorResponse(res, err.statusCode || 500, 'An unexpected error occurred. Please try again', []);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
