// Set timezone to Indian Standard Time (IST)
process.env.TZ = 'Asia/Kolkata';

import 'dotenv/config';
import express, { Application } from 'express';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import participantRoutes from './routes/participant.routes';
import attendanceRoutes from './routes/attendance.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware to handle incoming JSON requests
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup aborted due to database connection error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
