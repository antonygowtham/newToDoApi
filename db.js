import pg from "pg"
import env from "dotenv";

env.config();

const pool = new pg.Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
});

pool.connect()
    .then(() => console.log("Connected to the database"))
    .catch(err => console.error("DB Connection error", err.stack));

export default pool;