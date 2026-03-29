// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Travel Buddy API is running...');
});

const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const guideRoutes = require('./routes/guideRoutes');
const sponsorshipRoutes = require('./routes/sponsorshipRoutes');
const skillRoutes = require('./routes/skillRoutes');

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/skills', skillRoutes);

// Global Error Handler must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
