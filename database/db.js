import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'smilevista'
};

let pool;

export async function initDb() {
  try {
    // On managed hosts like Hostinger the DB user cannot CREATE DATABASE.
    // Only try to auto-create the database when explicitly allowed (local dev).
    const allowCreate = String(process.env.MYSQL_ALLOW_CREATE_DB || '').toLowerCase() === 'true';

    if (allowCreate) {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password
      });
      console.log(`Checking/Creating database: ${dbConfig.database}...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
      await connection.end();
    } else {
      console.log(`Using existing database: ${dbConfig.database} (skip CREATE)`);
    }

    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('✅ MySQL Pool Created');

    // 3. Create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        source VARCHAR(50) NOT NULL,
        service VARCHAR(255),
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        createdAt DATETIME NOT NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        imageUrl TEXT NOT NULL,
        createdAt DATETIME NOT NULL
      )
    `);
    console.log('✅ Database Tables Verified');
    return pool;
  } catch (err) {
    console.error('❌ Database Initialization Error:', err);
    throw err;
  }
}

export const dbRun = async (sql, params = []) => {
  if (!pool) throw new Error('Database pool not initialized. Call initDb() first.');
  const [result] = await pool.execute(sql, params);
  return { lastID: result.insertId, changes: result.affectedRows };
};

export const dbAll = async (sql, params = []) => {
  if (!pool) throw new Error('Database pool not initialized. Call initDb() first.');
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const dbGet = async (sql, params = []) => {
  if (!pool) throw new Error('Database pool not initialized. Call initDb() first.');
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
};
