import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export { sql, connectDB };