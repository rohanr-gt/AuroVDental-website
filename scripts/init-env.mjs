import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const envPath = path.join(__dirname, '.env');
const examplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env from .env.example');
  } else {
    console.warn('⚠️ .env.example not found. Skipping auto-creation.');
  }
} else {
  console.log('ℹ️ .env already exists.');
}
