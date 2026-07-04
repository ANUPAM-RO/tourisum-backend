import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database';
import { connectRedis } from './config/redis';

// Routes
import authRoutes from './routes/authRoutes';
import placeRoutes from './routes/placeRoutes';
import stateRoutes from './routes/stateRoutes';
import cityRoutes from './routes/cityRoutes';
import hotelRoutes from './routes/hotelRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tourism API is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize connections
let initialized = false;
const initConnections = async () => {
  if (initialized) return;
  try {
    await connectDB();
    await connectRedis();
    initialized = true;
    console.log('All connections initialized');
  } catch (error) {
    console.error('Connection initialization failed:', error);
    throw error;
  }
};

// Vercel serverless export
export default async function handler(req: any, res: any) {
  try {
    await initConnections();
    return app(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// Local development server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  initConnections().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}
