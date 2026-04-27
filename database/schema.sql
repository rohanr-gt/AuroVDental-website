-- SmileVista Dental - MySQL Schema Reference

CREATE DATABASE IF NOT EXISTS `smilevista`;
USE `smilevista`;

-- Table for patient leads and booking requests
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  source VARCHAR(50) NOT NULL, -- e.g., 'booking', 'contact', 'assessment'
  service VARCHAR(255),
  message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- e.g., 'new', 'contacted', 'scheduled'
  createdAt DATETIME NOT NULL
);

-- Table for the Before & After gallery
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  imageUrl TEXT NOT NULL,
  createdAt DATETIME NOT NULL
);
