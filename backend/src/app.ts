import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { authRoutes } from './routes/auth';
import workerRoutes from './routes/workers';
import shifts from './routes/shifts';
import workerPeriodHoursRoutes from './routes/workerPeriodHours.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/shifts', shifts);
app.use('/api/worker-period-hours', workerPeriodHoursRoutes);

// Error handling
app.use(errorHandler);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });

export default app;
