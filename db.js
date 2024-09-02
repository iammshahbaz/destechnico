const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.connect((err, client, done) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
        process.exit(1);
    } else {
        console.log('Database connected');
        done();
    }
});




module.exports = pool;
