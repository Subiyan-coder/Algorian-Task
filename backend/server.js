require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();
app.use(cors({
  origin: [
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
