// Set timezone to Indian Standard Time (IST)
process.env.TZ = 'Asia/Kolkata';

import 'dotenv/config';
import express, { Application } from 'express';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import participantRoutes from './routes/participant.routes';
import attendanceRoutes from './routes/attendance.routes';
import dashboardRoutes from './routes/dashboard.routes';
import adminRoutes from './routes/admin.routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// CORS middleware to allow requests from frontend (e.g. http://localhost:5173)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Body parser middleware to handle incoming JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploaded images statically (e.g. GET http://localhost:5000/uploads/events/xxx.jpg)
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler (handles Multer errors, body parser errors, etc.)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
    return;
  }
  if (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error occurred.',
    });
    return;
  }
  next();
});

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
