import express from 'express';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import pdfRoutes from './routes/pdf.routes.js';


const PORT = process.env.PORT
const app = express();

app.use(express.json());

app.use('/api/v1/pdf', pdfRoutes);



app.get('/', (req, res) => {
  res.send('PDF Generator Backend is running!');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1);
});