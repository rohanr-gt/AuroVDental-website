import mysql from 'mysql2/promise';
import 'dotenv/config';

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || ''
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE || 'smilevista'}\`;`);
    console.log(`✅ Database "${process.env.MYSQL_DATABASE || 'smilevista'}" created or already exists.`);
  } catch (err) {
    console.error('❌ Error creating database:', err.message);
  } finally {
    await connection.end();
  }
}

setup();
