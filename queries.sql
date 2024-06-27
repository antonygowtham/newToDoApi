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

INSERT INTO newtasks (id, title, date, category, progress, is_finished, user_id)
VALUES ('1', 'Task 1', '2024-06-27', 'Work', 50, true, 1);

INSERT INTO newtasks (id, title, date, category, progress, is_finished, user_id)
VALUES ('2', 'Task 2', '2024-06-28', 'Personal', 25, false, 1);

INSERT INTO newtasks (id, title, date, category, progress, is_finished, user_id)
VALUES ('3', 'Task 3', '2024-06-29', 'due', 25, false, 1);