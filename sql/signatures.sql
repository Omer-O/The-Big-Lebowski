
DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    signature TEXT NOT NULL
);

ALTER TABLE signatures
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
