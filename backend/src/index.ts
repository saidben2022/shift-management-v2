import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source";
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import workerRoutes from './routes/workers';
import shiftRoutes from './routes/shifts';
import workerPeriodHoursRoutes from './routes/workerPeriodHours.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/worker-period-hours', workerPeriodHoursRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
}

startServer();
