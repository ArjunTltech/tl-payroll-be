import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import rootRoutes from './routes/index.js';
import rateLimit from 'express-rate-limit';


const PORT = process.env.PORT
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again after some time.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use('/api/v1/', rootRoutes);

app.get('/', (req, res) => {
  res.send('PDF Generator Backend is running!');
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }
};

startServer();