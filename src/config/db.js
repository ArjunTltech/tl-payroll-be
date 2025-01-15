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

// Create a pool that we'll reuse
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Function to get the pool
async function getPool() {
  await poolConnect;
  return pool;
}

async function connectDB() {
  try {
    await poolConnect;
    console.log('Connected to SQL Server');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export { sql, getPool, connectDB };