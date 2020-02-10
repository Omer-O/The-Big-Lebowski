
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL CHECK (first <> ''),
    last VARCHAR(255) NOT NULL CHECK (last <> ''),
    email TEXT NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
