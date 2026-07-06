require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const applyGlobalMiddleware = require('./middleware/globalMiddleware');
const globalErrorHandler = require('./middleware/errorHandler');
const v1Routes = require('./routes/v1');

connectDB();

const app = express();

applyGlobalMiddleware(app);

app.get('/', (req, res) => {
  res.json({ message: 'Assignment Tracker API is running', version: 'v1' });
});

app.use('/api/v1', v1Routes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));