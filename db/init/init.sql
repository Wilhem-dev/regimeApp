CREATE DATABASE IF NOT EXISTS regime;

USE regime;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sexe ENUM('homme','femme','autre') NOT NULL,
    age INT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    poids FLOAT NOT NULL,
    imc FLOAT NOT NULL,
    date_mesure TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
