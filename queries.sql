CREATE TABLE newusers (
	id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255)
);

CREATE TABLE newtasks (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    date VARCHAR(300),
    category VARCHAR(100),
    progress INT,
    is_finished BOOLEAN NOT NULL,
    user_id INTEGER REFERENCES newusers(id)
);