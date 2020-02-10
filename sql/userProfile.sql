DROP TABLE IF EXISTS profile;

CREATE TABLE profile(
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(255),
    url VARCHAR(255),
    user_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT
    CURRENT_TIMESTAMP
);

ALTER TABLE profile
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
