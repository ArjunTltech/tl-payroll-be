import { sql, getPool } from "../config/db.js";



export const createUser = async (name, email, password, role) => {
  try {

    const pool = await getPool();
    const result = await pool
      .request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO Users (name, email, password, role)
        VALUES (@name, @email, @password, @role);
      `);
    return result;
  }
  catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

export const getUserByEmail = async (email) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT * FROM Users
        WHERE email = @email;
      `);
    return result.recordset[0];
  }
  catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('Error getting user by email');
  }
}

export const getUserById = async (id) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT * FROM Users
        WHERE id = @id;
      `);
    return result.recordset[0];
  }
  catch (error) {
    console.error('Error getting user by id:', error);
    throw new Error('Error getting user by id');
  }
}


export const storeRefreshToken = async (userId, refreshToken) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .input('refreshToken', sql.NVarChar, refreshToken)
    .query(`
        UPDATE Users 
        SET refreshToken = @refreshToken
        WHERE id = @userId
      `);
};

